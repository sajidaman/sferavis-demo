type ApiRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  send: (body: Buffer) => void;
};

const IRSA_HOST = 'irsa.ipac.caltech.edu';
const MAX_UPSTREAM_BYTES = 16 * 1024 * 1024;
const FITS_BLOCK_BYTES = 2880;
const FITS_CARD_BYTES = 80;

function getNumber(value: string | string[] | undefined): number | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function readFitsHeader(
  bytes: Uint8Array,
  start: number,
): { headerEnd: number; paddedHeaderEnd: number; values: Map<string, string> } | null {
  const values = new Map<string, string>();
  const decoder = new TextDecoder('ascii');
  for (let offset = start; offset + FITS_CARD_BYTES <= bytes.length; offset += FITS_CARD_BYTES) {
    const card = decoder.decode(bytes.subarray(offset, offset + FITS_CARD_BYTES));
    const keyword = card.slice(0, 8).trim();
    if (keyword === 'END') {
      const headerEnd = offset + FITS_CARD_BYTES;
      const paddedHeaderEnd = start + Math.ceil((headerEnd - start) / FITS_BLOCK_BYTES) * FITS_BLOCK_BYTES;
      return { headerEnd, paddedHeaderEnd, values };
    }
    if (card[8] === '=') values.set(keyword, card.slice(10, 80).split('/')[0].trim());
  }
  return null;
}

function getFitsDataLength(values: Map<string, string>): number | null {
  const bitpix = Number(values.get('BITPIX'));
  const axes = Number(values.get('NAXIS'));
  if (!Number.isInteger(bitpix) || !Number.isInteger(axes) || axes < 0 || axes > 9) return null;
  if (axes === 0) return 0;
  let elements = 1;
  for (let axis = 1; axis <= axes; axis += 1) {
    const length = Number(values.get(`NAXIS${axis}`));
    if (!Number.isSafeInteger(length) || length < 0) return null;
    elements *= length;
    if (!Number.isSafeInteger(elements)) return null;
  }
  const pcount = Number(values.get('PCOUNT') ?? '0');
  const gcount = Number(values.get('GCOUNT') ?? '1');
  if (!Number.isSafeInteger(pcount) || pcount < 0 || !Number.isSafeInteger(gcount) || gcount < 1) return null;
  return (elements * Math.abs(bitpix) / 8 + pcount) * gcount;
}

function keepPrimaryAndImage(bytes: Uint8Array): Buffer | null {
  const primary = readFitsHeader(bytes, 0);
  if (!primary) return null;
  const primaryDataLength = getFitsDataLength(primary.values);
  if (primaryDataLength === null) return null;
  const primaryDataEnd = primary.paddedHeaderEnd
    + Math.ceil(primaryDataLength / FITS_BLOCK_BYTES) * FITS_BLOCK_BYTES;
  const image = readFitsHeader(bytes, primaryDataEnd);
  if (!image || image.values.get('XTENSION')?.replace(/^['"]|['"]$/g, '').trim() !== 'IMAGE') return null;
  const imageDataLength = getFitsDataLength(image.values);
  if (imageDataLength === null || Number(image.values.get('NAXIS')) < 2) return null;
  const imageEnd = image.paddedHeaderEnd
    + Math.ceil(imageDataLength / FITS_BLOCK_BYTES) * FITS_BLOCK_BYTES;
  if (imageEnd > bytes.length) return null;
  return Buffer.from(bytes.subarray(0, imageEnd));
}

function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && inQuotes && line[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      inQuotes = !inQuotes;
    } else if (character === ',' && !inQuotes) {
      fields.push(field);
      field = '';
    } else {
      field += character;
    }
  }
  fields.push(field);
  return fields;
}

function getAccessUrl(csv: string): string | null {
  const lines = csv.split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length < 2) return null;
  const headers = parseCsvRow(lines[0]);
  const accessUrlIndex = headers.indexOf('access_url');
  if (accessUrlIndex < 0) return null;
  const accessUrl = parseCsvRow(lines[1])[accessUrlIndex];
  if (!accessUrl) return null;
  try {
    const url = new URL(accessUrl);
    if (
      url.protocol !== 'https:'
      || url.hostname !== IRSA_HOST
      || !url.pathname.startsWith('/ibe/data/spherex/')
    ) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const ra = getNumber(req.query?.ra);
  const dec = getNumber(req.query?.dec);
  const wavelength = getNumber(req.query?.wavelength);
  const size = getNumber(req.query?.size);
  if (
    ra === null || ra < 0 || ra >= 360
    || dec === null || dec < -90 || dec > 90
    || wavelength === null || wavelength < 0.75 || wavelength > 5.01
    || size === null || size < 0.1 || size > 0.5
  ) {
    return res.status(400).json({ error: 'A valid sky position, wavelength, and cutout size are required.' });
  }

  const position = `${ra.toFixed(7)} ${dec.toFixed(7)}`;
  const search = new URL('https://irsa.ipac.caltech.edu/SIA');
  search.search = new URLSearchParams({
    COLLECTION: 'spherex_dr1',
    POS: `CIRCLE ${position} 0.001`,
    BAND: `${wavelength}e-6`,
    CALIB: '2',
    DPTYPE: 'image',
    CLOSEST: 'COLLECTION',
    MAXREC: '1',
    RESPONSEFORMAT: 'CSV',
  }).toString();

  try {
    const searchResponse = await fetch(search, { signal: AbortSignal.timeout(20000) });
    if (!searchResponse.ok) {
      console.error('SPHEREx detail: IRSA search failed.', { status: searchResponse.status });
      return res.status(502).json({ error: 'IRSA could not search SPHEREx exposures.' });
    }
    const accessUrl = getAccessUrl(await searchResponse.text());
    if (!accessUrl) {
      return res.status(404).json({ error: 'No DR1 exposure covers this position and wavelength.' });
    }

    const cutoutUrl = new URL(accessUrl);
    cutoutUrl.search = new URLSearchParams({
      center: `${ra.toFixed(7)},${dec.toFixed(7)}`,
      size: size.toFixed(3),
    }).toString();
    const cutoutResponse = await fetch(cutoutUrl, { signal: AbortSignal.timeout(20000) });
    if (!cutoutResponse.ok) {
      console.error('SPHEREx detail: IRSA cutout failed.', { status: cutoutResponse.status });
      return res.status(502).json({ error: 'IRSA could not create the SPHEREx exposure cutout.' });
    }

    const cutout = new Uint8Array(await cutoutResponse.arrayBuffer());
    if (cutout.length > MAX_UPSTREAM_BYTES) {
      console.error('SPHEREx detail: IRSA cutout exceeded the size limit.', { bytes: cutout.length });
      return res.status(502).json({ error: 'The SPHEREx cutout exceeded the supported size.' });
    }
    const imageOnlyFits = keepPrimaryAndImage(cutout);
    if (!imageOnlyFits) {
      console.error('SPHEREx detail: Could not isolate the IMAGE HDU from the IRSA cutout.');
      return res.status(502).json({ error: 'The SPHEREx cutout had an unsupported FITS structure.' });
    }

    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/fits');
    res.setHeader('Content-Disposition', 'inline; filename="spherex-detail.fits"');
    res.setHeader('Content-Length', String(imageOnlyFits.length));
    return res.status(200).send(imageOnlyFits);
  } catch (error) {
    console.error('SPHEREx detail: IRSA request failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(502).json({ error: 'Could not load SPHEREx exposure detail from IRSA.' });
  }
}

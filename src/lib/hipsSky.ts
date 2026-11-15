const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const TILE_WIDTH = 512;
const TILE_ORDER_BITS = 9;
const TILE_PIXEL_COUNT = 1 << (TILE_ORDER_BITS * 2);

function spreadBits(value: number): number {
  let result = 0;
  for (let bit = 0; bit < 16; bit += 1) {
    result += ((value >> bit) & 1) * 2 ** (bit * 2);
  }
  return result;
}

function compactBits(value: number): number {
  let result = 0;
  for (let bit = 0; bit < 16; bit += 1) {
    result += (Math.floor(value / 2 ** (bit * 2)) & 1) * 2 ** bit;
  }
  return result;
}

export function healpixNested(order: number, ra: number, dec: number): number {
  const nside = 2 ** order;
  const z = Math.sin(dec * DEG_TO_RAD);
  const absZ = Math.abs(z);
  let phi = ((ra * DEG_TO_RAD) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  const tt = phi / (Math.PI / 2);
  let face: number;
  let x: number;
  let y: number;

  if (absZ <= 2 / 3) {
    const jp = Math.floor(nside * (0.5 + tt) - nside * z * 0.75);
    const jm = Math.floor(nside * (0.5 + tt) + nside * z * 0.75);
    const ifp = Math.floor(jp / nside);
    const ifm = Math.floor(jm / nside);
    face = ifp === ifm ? (ifp & 3) + 4 : ifp < ifm ? ifp & 3 : (ifm & 3) + 8;
    x = jm & (nside - 1);
    y = nside - (jp & (nside - 1)) - 1;
  } else {
    let quadrant = Math.floor(tt);
    if (quadrant >= 4) quadrant = 3;
    const tp = tt - quadrant;
    const tmp = nside * Math.sqrt(3 * (1 - absZ));
    const jp = Math.min(nside - 1, Math.floor(tp * tmp));
    const jm = Math.min(nside - 1, Math.floor((1 - tp) * tmp));
    if (z >= 0) {
      face = quadrant;
      x = nside - jm - 1;
      y = nside - jp - 1;
    } else {
      face = quadrant + 8;
      x = jp;
      y = jm;
    }
  }

  return face * nside * nside + spreadBits(x) + 2 * spreadBits(y);
}

export function locateHiPSTile(order: number, ra: number, dec: number) {
  return locateNestedTile(healpixNested(order + TILE_ORDER_BITS, ra, dec));
}

export function locateNestedTile(nestedPixel: number) {
  const tilePixel = Math.floor(nestedPixel / TILE_PIXEL_COUNT);
  const withinTile = nestedPixel % TILE_PIXEL_COUNT;

  return {
    pixel: tilePixel,
    x: compactBits(withinTile),
    y: compactBits(Math.floor(withinTile / 2)),
  };
}

export function selectHiPSOrder(fovDegrees: number, viewportHeight: number, maxOrder: number): number {
  const screenPixelDegrees = fovDegrees / Math.max(1, viewportHeight);
  const maxOrderPixelDegrees = 0.0035786;
  return Math.max(
    0,
    Math.min(maxOrder, Math.floor(maxOrder + Math.log2(maxOrderPixelDegrees / screenPixelDegrees))),
  );
}

export function tilePath(
  order: number,
  pixel: number,
  frameIndex: number,
  nestedFrameDirectory: boolean,
  extension: 'png' | 'jpg' = 'png',
): string {
  const directory = Math.floor(pixel / 10000) * 10000;
  const suffix = frameIndex === 0 ? '' : `_${frameIndex}`;
  const filename = `Npix${pixel}${suffix}.${extension}`;
  const path = `Norder${order}/Dir${directory}/Npix${pixel}`;
  return nestedFrameDirectory ? `${path}/${filename}` : `Norder${order}/Dir${directory}/${filename}`;
}

export function colorMapLookup(name: 'grayscale' | 'magma'): Uint8Array {
  const lookup = new Uint8Array(256 * 3);
  const stops: Array<[number, number, number, number]> = name === 'magma'
    ? [[0, 0, 0, 4], [0.25, 81, 18, 124], [0.5, 183, 55, 121], [0.75, 252, 137, 97], [1, 252, 253, 191]]
    : [[0, 0, 0, 0], [1, 255, 255, 255]];

  for (let value = 0; value < 256; value += 1) {
    const t = value / 255;
    let stopIndex = 0;
    while (stopIndex < stops.length - 2 && t > stops[stopIndex + 1][0]) stopIndex += 1;
    const start = stops[stopIndex];
    const end = stops[stopIndex + 1];
    const amount = (t - start[0]) / (end[0] - start[0]);
    for (let channel = 0; channel < 3; channel += 1) {
      lookup[value * 3 + channel] = Math.round(start[channel + 1] + (end[channel + 1] - start[channel + 1]) * amount);
    }
  }
  return lookup;
}

export interface FitsImage {
  width: number;
  height: number;
  values: Float32Array;
  header: Map<string, number>;
}

function parseHeader(bytes: Uint8Array, offset: number) {
  const header = new Map<string, number>();
  const card = new TextDecoder('ascii');
  for (let block = offset; block + 2880 <= bytes.length; block += 2880) {
    for (let index = 0; index < 36; index += 1) {
      const start = block + index * 80;
      const line = card.decode(bytes.subarray(start, start + 80));
      const key = line.slice(0, 8).trim();
      if (key === 'END') return { header, dataOffset: block + 2880 };
      if (line[8] !== '=' || key === 'XTENSION' || key === 'COMMENT' || key === 'HISTORY') continue;
      const rawValue = line.slice(10).split('/')[0].trim();
      const value = Number(rawValue.replace(/[dD]/, 'e'));
      if (Number.isFinite(value)) header.set(key, value);
    }
  }
  return null;
}

export function decodeFitsImage(buffer: ArrayBuffer): FitsImage {
  const bytes = new Uint8Array(buffer);
  let offset = 0;

  for (let hdu = 0; hdu < 8; hdu += 1) {
    const parsed = parseHeader(bytes, offset);
    if (!parsed) throw new Error('The exposure FITS header is incomplete.');
    const { header, dataOffset } = parsed;
    const width = header.get('NAXIS1') ?? 0;
    const height = header.get('NAXIS2') ?? 0;
    const axes = header.get('NAXIS') ?? 0;
    const bitpix = header.get('BITPIX') ?? 0;
    const elements = axes === 0 ? 0 : Array.from({ length: axes }, (_, axis) => header.get(`NAXIS${axis + 1}`) ?? 0)
      .reduce((product, length) => product * length, 1);
    const byteLength = elements * Math.abs(bitpix) / 8;
    const isImage = axes === 2;

    if (isImage && width > 0 && height > 0 && dataOffset + byteLength <= bytes.length) {
      const view = new DataView(buffer, dataOffset, byteLength);
      const values = new Float32Array(width * height);
      const scale = header.get('BSCALE') ?? 1;
      const zero = header.get('BZERO') ?? 0;
      const blank = header.get('BLANK');
      for (let index = 0; index < values.length; index += 1) {
        const byteOffset = index * Math.abs(bitpix) / 8;
        let value: number;
        if (bitpix === -32) value = view.getFloat32(byteOffset, false);
        else if (bitpix === -64) value = view.getFloat64(byteOffset, false);
        else if (bitpix === 16) value = view.getInt16(byteOffset, false);
        else if (bitpix === 32) value = view.getInt32(byteOffset, false);
        else if (bitpix === 8) value = view.getUint8(byteOffset);
        else throw new Error(`Unsupported FITS pixel format (${bitpix}).`);
        values[index] = value === blank ? Number.NaN : value * scale + zero;
      }
      return { width, height, values, header };
    }

    offset = dataOffset + Math.ceil(byteLength / 2880) * 2880;
  }

  throw new Error('The exposure FITS file has no supported image extension.');
}

export function fitsPixelAtSky(image: FitsImage, ra: number, dec: number): [number, number] | null {
  const header = image.header;
  const ra0 = (header.get('CRVAL1') ?? 0) * DEG_TO_RAD;
  const dec0 = (header.get('CRVAL2') ?? 0) * DEG_TO_RAD;
  const targetRa = ra * DEG_TO_RAD;
  const targetDec = dec * DEG_TO_RAD;
  const deltaRa = targetRa - ra0;
  const denominator = Math.sin(dec0) * Math.sin(targetDec)
    + Math.cos(dec0) * Math.cos(targetDec) * Math.cos(deltaRa);
  if (denominator <= 0) return null;

  const xi = Math.cos(targetDec) * Math.sin(deltaRa) / denominator * RAD_TO_DEG;
  const eta = (
    Math.cos(dec0) * Math.sin(targetDec)
    - Math.sin(dec0) * Math.cos(targetDec) * Math.cos(deltaRa)
  ) / denominator * RAD_TO_DEG;
  const cd11 = header.get('CD1_1') ?? (header.get('PC1_1') ?? 1) * (header.get('CDELT1') ?? 1);
  const cd12 = header.get('CD1_2') ?? (header.get('PC1_2') ?? 0) * (header.get('CDELT1') ?? 1);
  const cd21 = header.get('CD2_1') ?? (header.get('PC2_1') ?? 0) * (header.get('CDELT2') ?? 1);
  const cd22 = header.get('CD2_2') ?? (header.get('PC2_2') ?? 1) * (header.get('CDELT2') ?? 1);
  const determinant = cd11 * cd22 - cd12 * cd21;
  if (!Number.isFinite(determinant) || determinant === 0) return null;

  const dx = (cd22 * xi - cd12 * eta) / determinant;
  const dy = (-cd21 * xi + cd11 * eta) / determinant;
  return [(header.get('CRPIX1') ?? 1) - 1 + dx, (header.get('CRPIX2') ?? 1) - 1 + dy];
}

export function percentileRange(values: Float32Array): [number, number] | null {
  const finite = Array.from(values).filter(Number.isFinite).sort((a, b) => a - b);
  if (finite.length === 0) return null;
  const low = finite[Math.floor((finite.length - 1) * 0.02)];
  const high = finite[Math.floor((finite.length - 1) * 0.98)];
  return high > low ? [low, high] : [low, low + 1];
}

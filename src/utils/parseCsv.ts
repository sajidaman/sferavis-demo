export interface CsvTable {
  headers: string[];
  rows: Array<Record<string, string>>;
}

export function parseCsv(text: string): CsvTable {
  const records: string[][] = [];
  let record: string[] = [];
  let field = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];

    if (character === '"') {
      if (insideQuotes && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === ',' && !insideQuotes) {
      record.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !insideQuotes) {
      if (character === '\r' && text[i + 1] === '\n') i += 1;
      record.push(field);
      if (record.some((value) => value.length > 0)) records.push(record);
      record = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (insideQuotes) throw new Error('The CSV file ends inside a quoted field.');
  if (field.length > 0 || record.length > 0) {
    record.push(field);
    records.push(record);
  }
  if (records.length === 0) throw new Error('The CSV file is empty.');

  const headers = records[0].map((header, index) => (index === 0 ? header.replace(/^\uFEFF/, '') : header).trim());
  if (headers.some((header) => header.length === 0)) {
    throw new Error('The CSV file contains an empty column name.');
  }

  const rows = records.slice(1).map((values, index) => {
    if (values.length !== headers.length) {
      throw new Error(`CSV row ${index + 2} has ${values.length} fields; expected ${headers.length}.`);
    }
    return Object.fromEntries(headers.map((header, column) => [header, values[column]]));
  });

  return { headers, rows };
}

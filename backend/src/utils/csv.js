import AppError from "./AppError.js";

export function parseCsv(content) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    if (quoted) {
      if (character === '"' && content[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new AppError("CSV contains an unclosed quoted field", 400);
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  if (rows.length < 1) throw new AppError("CSV must contain a header row", 400);

  const headers = rows[0].map((header) => header.trim());
  if (headers.some((header) => !header)) throw new AppError("CSV contains an empty column name", 400);
  if (new Set(headers).size !== headers.length) throw new AppError("CSV contains duplicate column names", 400);

  const records = rows.slice(1).filter((values) => values.some((value) => value !== ""));
  const invalidRow = records.find((values) => values.length !== headers.length);
  if (invalidRow) throw new AppError("CSV rows must have the same number of values as the header", 400);

  return { headers, records };
}

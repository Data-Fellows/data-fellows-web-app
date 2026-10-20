// Per OWASP's CSV injection guidance, a leading tab (0x09) or carriage
// return (0x0D) can also trigger formula evaluation in some spreadsheet
// apps even before one of the "real" formula characters, since those
// apps trim leading whitespace/control characters when deciding whether
// a cell is a formula.
const FORMULA_PREFIX = /^[\t\r=+\-@]/;

export const csvCell = (value: string) => {
  const safe = FORMULA_PREFIX.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

export const buildCsv = (rows: string[][]) =>
  rows.map((cols) => cols.map(csvCell).join(",")).join("\n");

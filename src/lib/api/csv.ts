const FORMULA_PREFIX = /^[=+\-@]/;

export const csvCell = (value: string) => {
  const safe = FORMULA_PREFIX.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

export const buildCsv = (rows: string[][]) =>
  rows.map((cols) => cols.map(csvCell).join(",")).join("\n");

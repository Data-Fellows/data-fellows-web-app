// Shared helpers for building admin CSV exports from user-submitted data
// (challenge check-ins, session registrations, etc).

// A cell value beginning with =, +, -, or @ can be interpreted as a
// formula by spreadsheet apps (Excel, Google Sheets, etc.) when the CSV is
// opened -- classic CSV/formula injection. Since these exports always
// include at least one field supplied by an unauthenticated visitor (a
// check-in name, a registration name), prefix a leading apostrophe to
// force spreadsheet apps to treat the cell as plain text, per OWASP's CSV
// injection guidance. Applied to every cell, not just the obviously
// user-supplied ones, since that's cheap and avoids having to reason case
// by case about which columns can never start with those characters.
const FORMULA_PREFIX = /^[=+\-@]/;

export const csvCell = (value: string) => {
  const safe = FORMULA_PREFIX.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
};

export const buildCsv = (rows: string[][]) =>
  rows.map((cols) => cols.map(csvCell).join(",")).join("\n");

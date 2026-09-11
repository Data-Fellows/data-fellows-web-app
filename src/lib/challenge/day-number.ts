// A challenge's days are consecutive dates starting from start_date, so
// "today's day number" is derived rather than stored per-day.
export const dayNumberForToday = (startDate: string) => {
  const start = new Date(`${startDate}T00:00:00Z`);
  const today = new Date();
  const utcToday = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  const diffDays = Math.round(
    (utcToday.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays + 1;
};

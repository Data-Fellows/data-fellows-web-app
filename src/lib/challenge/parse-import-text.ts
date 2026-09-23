// Parses a pasted challenge write-up (e.g. copied straight out of a Word
// doc) into form-ready fields. Looks for "Day N -- Title" headers -- the
// pattern used in every challenge curriculum doc so far -- and splits the
// rest into per-day summaries. Heuristic, not a real document parser:
// admins should review the result before saving, not trust it blindly.
export type ParsedChallengeImport = {
  title: string;
  subtitle: string;
  daily_commitment: string;
  days: { title: string; summary: string }[];
};

const DAY_HEADER = /^day\s+(\d+)\s*[-–—:]+\s*(.+)$/i;

// "Seven days", "7 days", "5-day", etc, paired with a per-day time hint.
const COMMITMENT_LINE = /\b\d+\s*[-–—]?\s*\d*\s*(min|minutes|hour|hours)\b/i;

export const parseChallengeImportText = (raw: string): ParsedChallengeImport => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const dayStarts: { index: number; dayNumber: number; title: string }[] = [];
  lines.forEach((line, index) => {
    const match = line.match(DAY_HEADER);
    if (match) {
      dayStarts.push({ index, dayNumber: Number(match[1]), title: match[2].trim() });
    }
  });

  const headerLines = dayStarts.length > 0 ? lines.slice(0, dayStarts[0].index) : lines.slice(0, 5);
  const title = headerLines[0] ?? "";
  const subtitle = headerLines.find((line, i) => i > 0 && !COMMITMENT_LINE.test(line)) ?? "";
  const rawCommitmentLine = headerLines.find((line) => COMMITMENT_LINE.test(line)) ?? "";
  // "Seven days -- 60-90 minutes a day" -> just the time portion; the
  // duration itself comes from the start/end dates the admin sets.
  const commitmentLine = rawCommitmentLine.includes("·")
    ? rawCommitmentLine.split("·").pop()!.trim()
    : rawCommitmentLine;

  const days = dayStarts.map((day, i) => {
    const end = dayStarts[i + 1]?.index ?? lines.length;
    const body = lines.slice(day.index + 1, end);
    // Prefer a "By tonight: ..." style one-liner if the doc has one --
    // it's already written as a summary. Otherwise fall back to the
    // first real line of content.
    const tonightLine = body.find((line) => /^by tonight/i.test(line));
    const firstContentLine = body.find(
      (line) => !/^(learn|build)\b/i.test(line) && line.length > 0
    );
    const summary = (tonightLine ?? firstContentLine ?? "").slice(0, 500);
    return { title: day.title, summary };
  });

  return { title, subtitle, daily_commitment: commitmentLine, days };
};

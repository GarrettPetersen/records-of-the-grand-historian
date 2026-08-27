const DURABLE_CAREER_PREDICATES = new Set([
  'office',
  'noble-title',
  'enfeoffment',
  'honor',
  'status',
]);

const CAREER_CUE_PATTERNS = [
  /\b(?:was|were|is|are|be|been|being)\s+(?:(?:also|then|soon|later|posthumously)\s+)*(?:appointed|promoted|transferred|demoted|enfeoffed|commissioned)\b/iu,
  /\b(?:appointed|promoted|transferred|demoted|enfeoffed|commissioned)\s+(?:him|her|them)\b/iu,
  /\b(?:[Hh]e|[Ss]he|[Tt]hey|\p{Lu}[\p{L}'-]*(?:\s+\p{Lu}[\p{L}'-]*){0,3})\s+(?:(?:also|then|later|successively)\s+)*(?:served|serves|was serving|is serving)\s+as\b/u,
  /\b(?:became|become)\s+(?:an?\s+|the\s+)?(?:administrator|attendant|chancellor|commander|commandant|censor|director|general|governor|inspector|libationer|magistrate|marshal|minister|prefect|secretary|supervisor|tutor)\b/iu,
  /\b(?:was|were)\s+(?:(?:also|then|soon|later|posthumously)\s+)*made\s+(?:an?\s+|the\s+)?(?:[A-Z][\p{L}'-]*\s+){0,5}(?:administrator|attendant|baron|chancellor|commander|commandant|count|duke|emperor|general|governor|inspector|king|magistrate|marquis|marshal|minister|prefect|prince|secretary|supervisor|tutor|viscount)\b/iu,
  /\b(?:granted|given)\s+(?:(?:him|her|them)\s+)?(?:an?\s+|the\s+)?(?:additional\s+|posthumous\s+)?(?:office|rank|title)\b/iu,
];

export const MIN_CAREER_CUE_UNITS = 8;
export const MIN_DURABLE_CAREER_COVERAGE = 0.2;

export function durableCareerCoverage(extraction, packet) {
  const cueUnits = packet.units.filter((unit) =>
    CAREER_CUE_PATTERNS.some((pattern) => pattern.test(unit.en) || pattern.test(unit.literal))
  );
  const coveredUnitIds = new Set(
    extraction.claims
      .filter((claim) => DURABLE_CAREER_PREDICATES.has(claim.predicate))
      .flatMap((claim) => claim.evidence)
      .map((unitId) => unitId.split(':').at(-1)),
  );
  const covered = cueUnits.filter((unit) => coveredUnitIds.has(unit.id));
  return {
    cueUnits,
    covered,
    ratio: cueUnits.length === 0 ? 1 : covered.length / cueUnits.length,
  };
}

export function assertDurableCareerCoverage(extraction, packet) {
  if (extraction.run?.promptVersion < 7 || extraction.coverage?.allDurableFactsCaptured !== true) return;
  const coverage = durableCareerCoverage(extraction, packet);
  if (
    coverage.cueUnits.length < MIN_CAREER_CUE_UNITS ||
    coverage.ratio >= MIN_DURABLE_CAREER_COVERAGE
  ) return;
  const coveredIds = new Set(coverage.covered.map((unit) => unit.id));
  const missing = coverage.cueUnits
    .filter((unit) => !coveredIds.has(unit.id))
    .slice(0, 8)
    .map((unit) => unit.id)
    .join(', ');
  throw new Error(
    `coverage.allDurableFactsCaptured is not credible: only ${coverage.covered.length}/` +
    `${coverage.cueUnits.length} strong career cue units have office, title, enfeoffment, ` +
    `honor, or status claims (first uncovered: ${missing})`,
  );
}

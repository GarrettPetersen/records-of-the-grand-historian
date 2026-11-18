export function addCompactSurface(compact, person, kind, candidate) {
  let surface = compact.surfaces.find((row) => (
    row[0] === person && row[1] === kind && row[2] === candidate.language && row[3] === candidate.exact
  ));
  if (!surface) {
    surface = [person, kind, candidate.language, candidate.exact, []];
    compact.surfaces.push(surface);
  }
  let unit = surface[4].find(([unitId]) => unitId === candidate.unit);
  if (!unit) {
    unit = [candidate.unit, []];
    surface[4].push(unit);
  }
  if (unit[1].includes(candidate.occurrence)) {
    throw new Error(`${candidate.id} is already present in the selected surface`);
  }
  unit[1].push(candidate.occurrence);
  unit[1].sort((left, right) => left - right);
}

from pathlib import Path
J=Path(__file__).resolve().parent
p=J/'candidate/scripts/lib/people-resolution.mjs'
s=p.read_text()
s=s[:s.index('export function resolvePeopleClusters(')]+r'''// Constraint groups store one branch label per member. They never expand a
// reviewed split or a merged cluster into its Cartesian product.
class ConstraintUnion {
  constructor(ids) {
    this.parent = new Map(ids.map(id => [id, id]));
    this.size = new Map(ids.map(id => [id, 1]));
    this.labels = new Map();
    this.labelVisits = 0;
  }
  find(id) {
    if (!this.parent.has(id)) throw new Error(`Unknown local person ${id}`);
    let root = id;
    while (this.parent.get(root) !== root) root = this.parent.get(root);
    while (id !== root) { const next = this.parent.get(id); this.parent.set(id, root); id = next; }
    return root;
  }
  add(id, constraint, branch) {
    const root = this.find(id);
    if (!this.labels.has(root)) this.labels.set(root, new Map());
    const labels = this.labels.get(root), old = labels.get(constraint);
    if (old !== undefined && old !== branch) throw new Error(`Resolution merges people explicitly kept separate: ${constraint}`);
    labels.set(constraint, branch);
  }
  conflict(left, right, kind = null) {
    const a = this.find(left), b = this.find(right);
    if (a === b) return false;
    let small = this.labels.get(a) ?? new Map(), large = this.labels.get(b) ?? new Map();
    if (small.size > large.size) [small, large] = [large, small];
    for (const [key, value] of small) {
      this.labelVisits += 1;
      if ((kind === null || key.startsWith(kind + ':')) && large.has(key) && large.get(key) !== value) return true;
    }
    return false;
  }
  union(left, right) {
    let keep = this.find(left), remove = this.find(right);
    if (keep === remove) return;
    if (this.conflict(keep, remove)) throw new Error(`Resolution merges people explicitly kept separate: ${left} and ${right}`);
    if (this.size.get(keep) < this.size.get(remove)) [keep, remove] = [remove, keep];
    this.parent.set(remove, keep); this.size.set(keep, this.size.get(keep) + this.size.get(remove)); this.size.delete(remove);
    let target = this.labels.get(keep) ?? new Map(), source = this.labels.get(remove) ?? new Map();
    if (target.size < source.size) [target, source] = [source, target];
    for (const [key, value] of source) { this.labelVisits += 1; target.set(key, value); }
    this.labels.set(keep, target); this.labels.delete(remove);
  }
}

// Used by dossier indexing and publication. Cost follows accepted evidence and
// constraint incidences, with union-by-size; no name buckets or pair graph.
export function resolveAcceptedPeopleClusters(localPeople, resolutionDocuments = []) {
  const ids = [...localPeople.keys()], explicit = explicitIdentityConstraints(localPeople);
  const modelMerges = [], curatedMerges = [], modelSplits = [], curatedSplits = [], possibleGroups = [], pins = new Map();
  for (const document of resolutionDocuments) for (const decision of document.decisions) {
    const members = [...new Set(decision.localPeople)];
    for (const id of members) if (!localPeople.has(id)) throw new Error(`${document.batch} refers to unknown local person ${id}`);
    const curated = document.authority === 'curated';
    if (decision.decision === 'merge') (curated ? curatedMerges : modelMerges).push({ batch: document.batch, members });
    else if (['keep-separate', 'split'].includes(decision.decision)) (curated ? curatedSplits : modelSplits).push(members);
    else if (decision.decision === 'possible-same-as') possibleGroups.push(members);
    else throw new Error(`Unknown identity decision ${decision.decision}`);
    if (decision.canonicalPersonId) for (const id of members) pins.set(id, decision.canonicalPersonId);
  }
  const intent = new ConstraintUnion(ids);
  for (const { members } of curatedMerges) for (const other of members.slice(1)) intent.union(members[0], other);
  const byIntent = new Map();
  for (const id of ids) { const root = intent.find(id); if (!byIntent.has(root)) byIntent.set(root, []); byIntent.get(root).push(id); }
  const union = new ConstraintUnion(ids), separationGroups = [];
  let incidences = 0;
  const addGroup = (kind, branches) => {
    const key = `${kind}:${separationGroups.length}`, group = { key, branches };
    separationGroups.push(group);
    for (const [id, branch] of branches) { union.add(id, key, branch); incidences += 1; }
  };
  for (const members of curatedSplits) {
    const roots = members.map(id => intent.find(id));
    if (new Set(roots).size !== roots.length) throw new Error('Curated merge joins people explicitly kept separate');
    addGroup('curated', roots.flatMap(root => byIntent.get(root).map(id => [id, root])));
  }
  for (const key of explicit.different) addGroup('explicit', key.split('\u0000').map(id => [id, id]));
  for (const key of explicit.same) {
    const [a, b] = key.split('\u0000');
    if (union.conflict(a, b, 'curated')) throw new Error(`Curated separation contradicts explicit same-person evidence for ${a} and ${b}`);
    union.union(a, b);
  }
  for (const { batch, members } of modelMerges) for (const other of members.slice(1)) {
    if (union.conflict(members[0], other, 'explicit')) throw new Error(`${batch} merges people explicitly identified as different`);
    if (!union.conflict(members[0], other, 'curated')) union.union(members[0], other);
  }
  const modelRoot = new Map(ids.map(id => [id, union.find(id)]));
  const override = new ConstraintUnion([...new Set(modelRoot.values())]), touched = new Set();
  for (const { members } of curatedMerges) {
    const roots = [...new Set(members.map(id => modelRoot.get(id)))];
    roots.forEach(root => touched.add(root));
    for (const other of roots.slice(1)) override.union(roots[0], other);
  }
  for (const members of modelSplits) addGroup('model', members.map(id => {
    const root = modelRoot.get(id);
    return [id, touched.has(root) ? `curated:${override.find(root)}` : `local:${id}`];
  }));
  for (const { members } of curatedMerges) for (const other of members.slice(1)) union.union(members[0], other);
  const byRoot = new Map();
  for (const id of ids) { const root = union.find(id); if (!byRoot.has(root)) byRoot.set(root, []); byRoot.get(root).push(id); }
  const clusters = [...byRoot.values()].map(members => {
    members.sort();
    const pinned = [...new Set(members.map(id => pins.get(id)).filter(Boolean))];
    if (pinned.length > 1) throw new Error(`Cluster has conflicting canonical IDs: ${pinned.join(', ')}`);
    const candidates = members.map(stableCanonicalPersonId).sort(), canonicalPersonId = pinned[0] ?? candidates[0];
    return { canonicalPersonId, localPeople: members, retiredIds: candidates.filter(id => id !== canonicalPersonId) };
  });
  const owners = new Map();
  for (const cluster of clusters) {
    if (owners.has(cluster.canonicalPersonId)) throw new Error(`Duplicate canonical person ID ${cluster.canonicalPersonId}`);
    owners.set(cluster.canonicalPersonId, cluster.localPeople[0]);
  }
  for (const cluster of clusters) cluster.retiredIds = cluster.retiredIds.filter(id => !owners.has(id));
  clusters.sort((a, b) => a.canonicalPersonId.localeCompare(b.canonicalPersonId));
  const canonicalByLocal = new Map(clusters.flatMap(cluster => cluster.localPeople.map(id => [id, cluster.canonicalPersonId])));
  return { clusters, separationGroups,
    possibleSameAsGroups: possibleGroups.map(members => [...new Set(members.map(id => canonicalByLocal.get(id)))]),
    metrics: { localPeople: ids.length, constraintIncidences: incidences, labelVisits: union.labelVisits, generatedPairs: 0 } };
}

// Historical pair consumers remain available only to drain retained assignments.
// New planning and publication use resolveAcceptedPeopleClusters directly.
export function resolvePeopleClusters(localPeople, resolutionDocuments = []) {
  const accepted = resolveAcceptedPeopleClusters(localPeople, resolutionDocuments), keepSeparate = new Set(), possibleSameAs = new Set();
  for (const { branches } of accepted.separationGroups) for (let a = 0; a < branches.length; a += 1) for (let b = a + 1; b < branches.length; b += 1) {
    if (branches[a][1] !== branches[b][1]) keepSeparate.add(pairKey(branches[a][0], branches[b][0]));
  }
  for (const members of accepted.possibleSameAsGroups) for (let a = 0; a < members.length; a += 1) for (let b = a + 1; b < members.length; b += 1) possibleSameAs.add(pairKey(members[a], members[b]));
  return { clusters: accepted.clusters, keepSeparate, possibleSameAs };
}
'''
p.write_text(s)

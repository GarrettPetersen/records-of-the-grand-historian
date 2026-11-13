# Cloud person lookup for chapter agents

This is a read-only evidence service, separate from inference and publication. The
host sends a chapter packet to a Cursor cloud agent; the agent retrieves relevant
canonical dossiers here rather than downloading the corpus or all person records.
`PEOPLE_SINGLE_OWNER_WORKFLOW.md` describes the chapter-owner/reviewer topology.

Live endpoint (verified November 13, 2026):
`https://24histories-people-lookup.garrett-m-petersen.workers.dev`.
Pinned prefix: `snapshots/cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac`.
Host smoke testing verified unauthenticated 401, manifest seal, Chinese-variant
search parity, dossier retrieval and member evidence. Eight offline tests pass.
This is service verification, not a completed chapter or a cloud-lane rollout.

## Data and API contract

The initial immutable generation comes from the existing November 3 native dossier
store: 228,270 canonical dossiers. Its public manifest records the original revision,
source seals and provenance. These are candidate identity evidence, **not** editorial,
chronology or publication approvals, nor a guarantee that the latest staging changes
are present. Work orders pin a generation; stop if a response uses another one.

All operations use GET and `Authorization: Bearer <lookup token>`, except `/health`.
The token grants lookup only. No Cloudflare credential goes to agents.

- `/v1/manifest`: pinned source generation, provenance and bounds.
- `/v1/search?q=Cao%20Cao&limit=8`: exact normalized name lookup. Prefer native
  `/v1/search?key=zh%3A...` keys obtained from dossiers. English normalization removes
  accents and lowercases; Chinese q uses the production native variant mapper.
  This is an indexed alias lookup, not fuzzy/full-text biography search. Results
  include full posting total/fingerprint and explicit truncation. Empty results and
  the first eight candidates never prove identity uniqueness.
- `/v1/people/per_ID`: versioned names, members, anchors and matching metadata.
- `/v1/people/per_ID?member=jinshu%3A053%3Ap001`: evidence for that exact member.
  Historical known IDs redirect within the response to their canonical dossier.

Search stores at most 64 candidate IDs per posting and returns at most eight.
Oversized evidence fails closed; ask the host for a sealed bounded packet rather
than truncating required review. The host must resolve ambiguous/truncated searches
using native indexed retrieval. API responses do not author identity decisions.
There are no write, inference, approval, claim or publication routes.

## Agent integration

Keep `PEOPLE_LOOKUP_URL` as the verified HTTPS deployment origin. The host credential
is stored outside the repo at `~/.local/share/24histories-people-lookup/client-token`,
mode 0600, or supplied through `PEOPLE_LOOKUP_TOKEN[_FILE]`. Never log it, paste it in
a prompt, put it in a URL, upload it as an artifact or commit it. Prefer SDK runtime
environment injection. The installed Cursor SDK supports `cloud.envVars` on create
and `agent.send(...,{cloud:{envVars}})` on resume.

```js
import {peopleLookupCloudOptions} from './scripts/lib/people-lookup-client.mjs';
// Merge with the work order's existing cloud metadata; do not replace it.
const cloud = {...existingCloudOptions, ...peopleLookupCloudOptions(), repos: [], autoCreatePR: false};
// Agent.create({apiKey, model: selectedReasoningModel, cloud, ...});
// For a retained cloud agent: agent.send(prompt, {cloud: peopleLookupCloudOptions()});
```

Only inject these two lookup variables, never the host environment or the Cloudflare
API token. If shipping the CLI, include `scripts/people-lookup.mjs`, its client module
and `scripts/load-dotenv.mjs`, not a cloned corpus. Its terminal tool can call:

```sh
node scripts/people-lookup.mjs --manifest
node scripts/people-lookup.mjs --name 'Cao Cao'
node scripts/people-lookup.mjs --person per_ID --member jinshu:053:p001
```

A packet-only cloud agent can also use its existing terminal tool directly, without
any repository files. Keep credentials out of command arguments and output:

```js
const response = await fetch(process.env.PEOPLE_LOOKUP_URL + '/v1/search?q=Cao%20Cao', {
  headers: {authorization: 'Bearer ' + process.env.PEOPLE_LOOKUP_TOKEN},
  redirect: 'error', signal: AbortSignal.timeout(15000),
});
if (!response.ok) throw Error('Lookup HTTP ' + response.status);
console.log(await response.text());
```

The client rejects redirects, non-HTTPS origins, missing credentials and HTTP errors.
429 means pause/resume; 503 means missing/corrupt storage or another failed lookup.
Never silently change snapshots or substitute a guessed identity. The helper is
available for launchers; existing cloud jobs are not retroactively reconfigured.

## Storage, deployment and recovery

Implementation: `services/people-lookup/`, with a private R2 bucket and Worker. Data
uses immutable native dossier byte ranges, checksums and 4,096 bounded hash-index
shards. SQLite Durable Object serializes a global budget; no corpus SQL import or
application database server is required. Local preparation streams the native files
and creates about 107 MiB of lookup indexes, not another 5 GiB checkout. Uploads
stream 32 MiB source chunks from the existing native store.

From the host checkout, after checking resource ownership:

```sh
npm run people:disk:check
node --test services/people-lookup/api.test.mjs
node scripts/prepare-people-lookup.mjs --registry NATIVE_STORE --out NEW_EXPORT_DIR
node scripts/deploy-people-lookup.mjs --export NEW_EXPORT_DIR
node scripts/deploy-people-lookup.mjs --export NEW_EXPORT_DIR --apply
node scripts/deploy-people-lookup.mjs --export NEW_EXPORT_DIR --apply --deploy
node scripts/verify-people-lookup.mjs --export NEW_EXPORT_DIR
```

Preparation validates native source hashes. Upload validates shards and dossier
bytes again, saves resumable `uploaded.jsonl` and publishes the manifest last.
Retain failed export/upload state for diagnosis. A local upload receipt is not a
remote backup guarantee; do not manually remove remote objects or use it as proof
of archival safety. Deploy requires the completion marker and matching remote
manifest. It pins `REGISTRY_PREFIX`, creates a private lookup credential if absent,
and installs only its SHA-256 verifier in the Worker. Auth fails closed during the
initial deploy before that verifier is set. Renewals preserve the old token unless
explicitly rotated. Use installed Wrangler; its older version uses `unsafe.bindings`
for the rate limiter and must show PEOPLE_RATE in dry-run output.

Use `.env`'s existing PRODUCTION_CLOUDFLARE_ACCOUNT_ID and
PRODUCTION_CLOUDFLARE_API_TOKEN only in the trusted deployment process. Never commit
export artifacts, credentials or an account-specific secret. Do not mutate another
project's buckets or change account billing. Rebuild/publish a new immutable export
after accepted canonical updates, verify it, then change the worker generation only
at an idle invocation boundary. Preserve old evidence generations needed by reviews.

## Cost and abuse controls

Auth is checked before R2 or Durable Object access. The edge limit is approximate
60/minute per location. The transactional global limiter admits at most 60/minute
and **1,000/day UTC** across all authenticated requests, including failed lookups.
Exhaustion is 429, with no paid-provider fallback. Static health and invalid-token
traffic do not access R2 or Durable Objects. Responses and record reads are bounded;
the Worker CPU setting is 10 ms. Start at this deliberately conservative pilot quota;
measure lookups per accepted chapter before changing it.

The initial dataset is roughly 0.61 GB and about 4,112 objects. This is within the
published R2 free storage/operation allotments if the account's other projects leave
that capacity. Free quotas are account-wide. **These controls are not an absolute
billing cap:** rejected requests still invoke the Worker, and authenticated floods
can invoke the limiter. Actual account billing tier was not verifiable with the
current token. Do not claim DDoS-proof zero cost or upgrade the account. For a paid
account requiring an absolute spend ceiling, establish account-level controls before
broadly distributing credentials. Disable the Worker if misuse is detected; private
R2 has no public endpoint configured.

Primary platform references: [rate limiter scope](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/),
[R2 pricing](https://developers.cloudflare.com/r2/pricing/),
[Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/),
[Workers limits](https://developers.cloudflare.com/workers/platform/limits/).

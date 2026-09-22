# Grok Bot MCP Operations Runbook

This is the reproducible operator guide for the 24histories people-glossary Grok Bot
connector. Read [`GROKBOT_PEOPLE_LANE.md`](GROKBOT_PEOPLE_LANE.md) first for the shared
queue, extraction-quality, validation, and publication rules. This document covers only
the transport and host operations.

## What runs where

- Grok Bot performs inference using the separate allowance supplied by the Cursor
  subscription. This service never calls xAI or purchases model inference.
- `scripts/grokbot-mcp-server.mjs` runs on the local Mac and listens only on
  `127.0.0.1:3001`.
- A Cloudflare Tunnel publishes only that HTTP service at
  `https://grokbot-mcp.24histories.com`. There is no Worker, database, or hosted compute.
- The MCP process uses an isolated sparse clone at
  `~/.local/share/24histories-grokbot-mcp/repo`. It must never use a dirty developer
  checkout as `PEOPLE_REPO_ROOT`.
- Grok Bot either connects through a native custom-MCP configuration or through the
  dependency-free `24histories-people` CLI installed on its shared cloud computer.

The public hostname is not an open service. `/mcp` requires the durable bearer token;
write operations additionally require a signed claim token tied to the worker, chapter
fingerprint, and sealed chunk plan. Host and Origin checks are enforced. `/health` and
the client source are intentionally unauthenticated; neither exposes repository data or
credentials. The single-use `/bootstrap` route exists only while an owner-only bootstrap
file is present and otherwise returns 404.

## Repository components

| Component | Purpose |
| --- | --- |
| `scripts/grokbot-mcp-server.mjs` | Authenticated MCP HTTP endpoint and one-time bootstrap route |
| `scripts/lib/grokbot-mcp-bridge.mjs` | Shared-queue claims, sealed packets, validation, and GitHub publication |
| `scripts/grokbot-mcp-client.mjs` | Dependency-free CLI used on the Grok Bot computer |
| `scripts/create-grokbot-mcp-bootstrap.mjs` | Creates a non-overwriting, single-use installer secret |
| `scripts/run-grokbot-mcp-local.sh` | Loads local secrets and starts the loopback-only origin |
| `scripts/test-grokbot-mcp-server.mjs` | Auth, tool-surface, claim-token, and bootstrap tests |

The MCP tool surface is deliberately limited to `resume_or_claim`, `get_chunk`,
`submit_chunk`, `finalize_chapter`, and `worker_status`. It provides no shell, arbitrary
file access, source edits, claim release, editorial acceptance, or date-audit approval.

## Prerequisites

- macOS on the always-on host. Apple Silicon uses native arm64 Node and `cloudflared`;
  Rosetta or Intel binaries are not required.
- Node.js 22 or newer, Git, GitHub CLI (`gh`), and `cloudflared` on `PATH`.
- `gh auth status` succeeds for an account that can read and write this repository.
- The GitHub credential has Contents read/write and Pull requests read/write permission.
- `24histories.com` is an active Cloudflare zone.

Install the native `cloudflared` package with `brew install cloudflared`. Cloudflare's
current locally-managed tunnel flow is `cloudflared tunnel login`, `tunnel create`,
`tunnel route dns`, and `tunnel --config ... run`.

## First-time host setup

All commands in this section run on the local Mac. Choose the reviewed ref containing
the connector. Until this feature reaches `master`, use
`codex/people-glossary-staging-v2`; after the milestone merge, use `master`:

```bash
export GROKBOT_MCP_REF=codex/people-glossary-staging-v2
export GROKBOT_MCP_RUNTIME_ROOT="$HOME/.local/share/24histories-grokbot-mcp"
mkdir -p "$GROKBOT_MCP_RUNTIME_ROOT/secrets" "$HOME/.local/state/24histories-grokbot-mcp"
chmod 700 "$GROKBOT_MCP_RUNTIME_ROOT" "$GROKBOT_MCP_RUNTIME_ROOT/secrets"
```

Create the persistent runtime clone. The root files plus `data/` and `scripts/` are
required; `public/` and full Git history are not:

```bash
git clone --depth 1 --filter=blob:none --sparse \
  --branch "$GROKBOT_MCP_REF" \
  https://github.com/GarrettPetersen/records-of-the-grand-historian \
  "$GROKBOT_MCP_RUNTIME_ROOT/repo"
git -C "$GROKBOT_MCP_RUNTIME_ROOT/repo" sparse-checkout set --cone data scripts
npm --prefix "$GROKBOT_MCP_RUNTIME_ROOT/repo" install
```

Generate independent 256-bit bearer and signing secrets. These files must never be
committed, uploaded, printed, or placed in a Bot conversation:

```bash
umask 077
openssl rand -hex 32 > "$GROKBOT_MCP_RUNTIME_ROOT/secrets/auth-token"
openssl rand -hex 32 > "$GROKBOT_MCP_RUNTIME_ROOT/secrets/claim-secret"
chmod 600 "$GROKBOT_MCP_RUNTIME_ROOT/secrets/auth-token" \
  "$GROKBOT_MCP_RUNTIME_ROOT/secrets/claim-secret"
```

`scripts/run-grokbot-mcp-local.sh` obtains the GitHub token from `gh auth token` each
time it starts. Do not copy a GitHub token into an environment file. Test the origin in
the foreground before installing services:

```bash
"$GROKBOT_MCP_RUNTIME_ROOT/repo/scripts/run-grokbot-mcp-local.sh"
```

From another terminal, `curl -fsS http://127.0.0.1:3001/health` must return JSON with
`"ok":true`. Stop the foreground process after this check.

## Create or recover the Cloudflare Tunnel

Authenticate interactively and create the named, locally-managed tunnel only if it does
not already exist:

```bash
cloudflared tunnel login
cloudflared tunnel list
cloudflared tunnel create 24histories-grokbot-mcp
cloudflared tunnel route dns 24histories-grokbot-mcp grokbot-mcp.24histories.com
```

The create command reports the tunnel UUID and creates its credential JSON. Write
`$GROKBOT_MCP_RUNTIME_ROOT/cloudflared.yml` with those exact values:

```yaml
tunnel: TUNNEL_UUID
credentials-file: /Users/YOU/.cloudflared/TUNNEL_UUID.json

ingress:
  - hostname: grokbot-mcp.24histories.com
    service: http://127.0.0.1:3001
  - service: http_status:404
```

The catch-all 404 rule is required. Validate and test it before installing the service:

```bash
cloudflared tunnel --config "$GROKBOT_MCP_RUNTIME_ROOT/cloudflared.yml" ingress validate
cloudflared tunnel --config "$GROKBOT_MCP_RUNTIME_ROOT/cloudflared.yml" run
```

Cloudflare documents that the tunnel credential JSON authenticates the tunnel and that
`cert.pem` is needed to create or change tunnels and DNS routes. Keep both out of Git.
The origin remains loopback-only; do not change `HOST` to `0.0.0.0` for this deployment.

## Install the macOS LaunchAgents

Use two per-user LaunchAgents so the origin and tunnel restart independently. Replace
`YOUR_HOME` below with the absolute home directory. The server's working directory and
script path should both point into the isolated runtime clone.

`~/Library/LaunchAgents/com.24histories.grokbot-mcp.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.24histories.grokbot-mcp</string>
  <key>ProgramArguments</key><array>
    <string>YOUR_HOME/.local/share/24histories-grokbot-mcp/repo/scripts/run-grokbot-mcp-local.sh</string>
  </array>
  <key>WorkingDirectory</key><string>YOUR_HOME/.local/share/24histories-grokbot-mcp/repo</string>
  <key>RunAtLoad</key><true/><key>KeepAlive</key><true/>
  <key>ThrottleInterval</key><integer>10</integer>
  <key>StandardOutPath</key><string>YOUR_HOME/.local/state/24histories-grokbot-mcp/server.log</string>
  <key>StandardErrorPath</key><string>YOUR_HOME/.local/state/24histories-grokbot-mcp/server.log</string>
</dict></plist>
```

`~/Library/LaunchAgents/com.24histories.grokbot-tunnel.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.24histories.grokbot-tunnel</string>
  <key>ProgramArguments</key><array>
    <string>YOUR_CLOUDFLARED_BINARY</string><string>--config</string>
    <string>YOUR_HOME/.local/share/24histories-grokbot-mcp/cloudflared.yml</string>
    <string>tunnel</string><string>run</string>
  </array>
  <key>RunAtLoad</key><true/><key>KeepAlive</key><true/>
  <key>ThrottleInterval</key><integer>10</integer>
  <key>StandardOutPath</key><string>YOUR_HOME/.local/state/24histories-grokbot-mcp/tunnel.log</string>
  <key>StandardErrorPath</key><string>YOUR_HOME/.local/state/24histories-grokbot-mcp/tunnel.log</string>
</dict></plist>
```

Validate and load them:

```bash
plutil -lint "$HOME/Library/LaunchAgents/com.24histories.grokbot-mcp.plist"
plutil -lint "$HOME/Library/LaunchAgents/com.24histories.grokbot-tunnel.plist"
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.24histories.grokbot-mcp.plist"
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.24histories.grokbot-tunnel.plist"
```

If a label is already loaded, use `launchctl bootout gui/$(id -u)/LABEL`, then bootstrap
its plist again. Do not use `sudo`; these are user agents and rely on the user's `gh`
authentication.

## Install or reconnect Grok Bot

Prefer a native custom MCP connector when the Grok Bot account exposes one:

- URL: `https://grokbot-mcp.24histories.com/mcp`
- Authentication: Bearer token from the local `secrets/auth-token` file
- Enabled tools: only the five tools listed above

If the account has no arbitrary custom-MCP installer, create a single-use bootstrap on
the Mac:

```bash
cd "$GROKBOT_MCP_RUNTIME_ROOT/repo"
npm run people:grokbot:mcp:bootstrap
```

The command prints one curl pipeline. Run it exactly once in the Grok Bot shared
computer's terminal. It installs:

- `~/.local/bin/24histories-people` — a wrapper with mode `0700`;
- `~/.local/lib/24histories/grokbot-mcp-client.mjs` — the client with mode `0700`;
- `~/.config/24histories/grokbot-mcp-token` — the bearer token under `umask 077`.

The server deletes `bootstrap.json` before returning the installer, so the URL cannot be
reused. If the request fails before consumption, rerun the printed command. If it was
consumed but installation failed, create a new bootstrap. Delete a stale unconsumed
bootstrap with `rm "$GROKBOT_MCP_RUNTIME_ROOT/bootstrap.json"` only after confirming no
installation is in flight.

Approve only that exact one-time command. Do not create a permanent auto-approval rule
for arbitrary curl installation scripts from this hostname. Never paste the durable
bearer token or either host secret into chat.

## Grok Bot operating procedure

Assign every concurrent Bot a stable ID matching `grokbot-[a-z0-9-]+`, for example
`grokbot-01`. A worker must finish or resume its sticky claim before receiving another.

### Credential-transmission authorization

The CLI keeps the durable bearer credential out of the prompt, terminal arguments, and
stdout, but every MCP call necessarily sends it in the HTTPS `Authorization` header to
the connector. An agent operating under computer-use confirmation rules correctly
treats that as credential transmission. Put this authorization in the **initial user
prompt** of every new Grok Bot conversation so the approved data and destination are
specific before the first MCP call:

```text
You are authorized to use the locally installed 24histories-people client. It may read
the locally stored 24 Histories MCP bearer credential and transmit it only as an HTTPS
Authorization header to https://grokbot-mcp.24histories.com/mcp, solely for the five
24 Histories people-glossary MCP operations. Never print, quote, copy, inspect, or send
that credential anywhere else. This authorization does not cover any other credential,
hostname, command, upload, or external action.
```

This authorizes the credential transmission without revealing the credential itself.
If a conversation began without that initial authorization, its policy may still require
an immediate confirmation before the first authenticated call. Approve that specific
transmission or start a new conversation with the authorization above; do not weaken the
MCP endpoint, place the token in chat, or add a broad terminal/curl auto-approval rule.

For a native connector, give the Bot the standing instruction in
[`GROKBOT_PEOPLE_LANE.md`](GROKBOT_PEOPLE_LANE.md). For the CLI fallback, use these exact
commands. Preserve `claimToken` from `resume` for all later calls:

```bash
24histories-people status --worker grokbot-01
24histories-people resume --worker grokbot-01
24histories-people get-chunk --claim-token CLAIM_TOKEN --chunk-id CHUNK_ID
24histories-people submit-chunk --claim-token CLAIM_TOKEN --chunk-id CHUNK_ID --file /absolute/path/output.json
24histories-people finalize --claim-token CLAIM_TOKEN
```

`resume` returns an existing sticky assignment before claiming fresh work. A deliberate
chapter may be requested with `--book BOOK --chapter NNN`; omit both for the calibrated
deadline-balanced allocator. Process chunks in the returned order and use only the
prompt, schema, packet, and draft returned by `get-chunk`. Validation failures are
expected to be repaired and resubmitted; they do not overwrite the last accepted chunk.
Stop after `finalize` returns the PR URL.

Do not ask the Bot to reveal its token file, run general shell commands, edit source
translations, release queue claims, accept date audits, or bypass validation. The claim
token can be retained in the active Bot conversation, but it is not a replacement for
the durable bearer token and cannot claim unrelated work.

## Health checks and daily operation

Run these without printing credentials:

```bash
launchctl print "gui/$(id -u)/com.24histories.grokbot-mcp"
launchctl print "gui/$(id -u)/com.24histories.grokbot-tunnel"
curl -fsS http://127.0.0.1:3001/health
curl -fsS https://grokbot-mcp.24histories.com/health
tail -n 100 "$HOME/.local/state/24histories-grokbot-mcp/server.log"
tail -n 100 "$HOME/.local/state/24histories-grokbot-mcp/tunnel.log"
```

The Mac must remain awake, logged in, and online while the user LaunchAgents serve work.
The screen may be locked: locking does not stop the MCP server or tunnel while the user
session remains logged in. A lock blocks GUI automation of the Grok Bot app, not MCP
calls from the installed client. Do not pause an MCP handoff merely because the screen is
locked; unlock only when the task actually requires GUI control. A public health response
proves routing, not MCP authorization or queue health. Use the installed CLI's
`status --worker grokbot-01` for an authenticated end-to-end check.

## Upgrade procedure

Never update the runtime clone while a chunk submission or finalization is in progress.
Commit and test connector changes in the development checkout first, then:

```bash
export GROKBOT_MCP_REF=codex/people-glossary-staging-v2
git -C "$GROKBOT_MCP_RUNTIME_ROOT/repo" fetch --depth 1 origin "$GROKBOT_MCP_REF"
git -C "$GROKBOT_MCP_RUNTIME_ROOT/repo" reset --hard FETCH_HEAD
npm --prefix "$GROKBOT_MCP_RUNTIME_ROOT/repo" install
launchctl kickstart -k "gui/$(id -u)/com.24histories.grokbot-mcp"
curl -fsS https://grokbot-mcp.24histories.com/health
```

The hard reset is safe only in this dedicated runtime clone. Never run it in a developer
checkout. Ignored `data/people/generated/grokbot/` recovery files survive the reset and
must not be deleted. The Grok Bot CLI downloads client updates only during bootstrap;
create a new one-time bootstrap when the client changes.

## Credential rotation

Rotate one credential at a time and verify the service before continuing.

Bearer token:

1. Replace `secrets/auth-token` atomically with a new `openssl rand -hex 32` value and
   mode `0600`.
2. Restart the MCP LaunchAgent.
3. Reinstall every Grok Bot client through a new single-use bootstrap, or update the
   native connector secret.
4. Confirm authenticated `status`; the old bearer token must now receive HTTP 401.

Claim-signing secret:

1. Wait until no Bot is between `resume` and `finalize`.
2. Replace `secrets/claim-secret` atomically and restart the MCP LaunchAgent.
3. Existing claim tokens are invalid. Each worker calls `resume` to obtain a new token
   for its unchanged sticky assignment.

GitHub credential: refresh `gh` authentication and restart the MCP LaunchAgent. Tunnel
credential: create or recover a Cloudflare tunnel credential JSON, update
`cloudflared.yml`, and restart only the tunnel LaunchAgent. Never reuse the MCP bearer or
claim-signing secret for GitHub or Cloudflare.

## Failure recovery

- Local health fails: inspect `server.log`, check Node 22+, `gh auth status`, secret file
  presence/modes, and the runtime clone. The launcher fails loudly on missing state.
- Local health works but public health fails: inspect `tunnel.log`, run
  `cloudflared tunnel info 24histories-grokbot-mcp`, validate the ingress file, and check
  DNS. Do not expose port 3001 directly as a workaround.
- A worker reports that the Mac is locked: verify public health and authenticated
  `worker_status`. If they pass, tell the worker to use its locally installed
  `24histories-people` client; no unlock is needed. Unlock only for GUI automation.
- HTTP 401: reinstall or reconfigure the client after bearer rotation. Do not weaken
  authentication.
- HTTP 403: check the exact request Host and Origin allowlists. The production allowed
  host is `grokbot-mcp.24histories.com`.
- A Bot was interrupted: rerun `resume` with the same worker ID. Never release the sticky
  claim merely to obtain fresh work.
- A chunk is rejected: correct the reported validation defects and resubmit the whole
  chunk object. The last accepted version remains intact.
- Finalization fails: fix GitHub authentication or repository access, then call
  `finalize` again with the same claim token. Publication is designed to be idempotent.
- Runtime clone is lost: recreate it, reinstall dependencies, and resume each worker.
  Queue claims and sealed plans are stored remotely; locally accepted but unfinalized
  chunks are not, so preserve and back up the ignored Grok Bot recovery directory.

The direct attachment workflow in `GROKBOT_PEOPLE_LANE.md` is the emergency fallback.
Do not silently switch transport or mark a chapter accepted without its byte-count,
SHA-256, scoped validation, and shared-queue transition.

## Validation and release checklist

Before committing or deploying connector changes:

```bash
npm run people:grokbot:mcp:self-test
npm run people:queue:self-test
zsh -n scripts/run-grokbot-mcp-local.sh
node --check scripts/grokbot-mcp-server.mjs
node --check scripts/grokbot-mcp-client.mjs
node --check scripts/create-grokbot-mcp-bootstrap.mjs
```

Then verify all of the following:

- Git diff contains no bearer, claim-signing, GitHub, Cloudflare, tunnel-credential, or
  one-time bootstrap secret.
- The runtime origin binds to `127.0.0.1`, not a LAN or all-interface address.
- `/mcp` returns 401 without authorization and exposes exactly five tools when authorized.
- `/bootstrap` returns 404 unless an intentional single-use bootstrap is pending.
- Local and public health checks pass.
- An authenticated `worker_status` succeeds from the actual Grok Bot transport.
- Only the intended connector files are staged and pushed.

Cloudflare reference: [Create a locally-managed tunnel](https://developers.cloudflare.com/tunnel/features/locally-managed-tunnels/create-local-tunnel/).

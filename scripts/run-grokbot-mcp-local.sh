#!/bin/zsh

set -euo pipefail

readonly SOURCE_ROOT="${0:A:h:h}"
readonly RUNTIME_ROOT="${GROKBOT_MCP_RUNTIME_ROOT:-$HOME/.local/share/24histories-grokbot-mcp}"
readonly SECRET_ROOT="$RUNTIME_ROOT/secrets"

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
readonly NODE_BIN="${GROKBOT_MCP_NODE_BIN:-$(command -v node)}"
readonly GH_BIN="${GROKBOT_MCP_GH_BIN:-$(command -v gh)}"
export PEOPLE_REPO_ROOT="$RUNTIME_ROOT/repo"
export GROKBOT_MCP_AUTH_TOKEN="$(<"$SECRET_ROOT/auth-token")"
export GROKBOT_MCP_CLAIM_SECRET="$(<"$SECRET_ROOT/claim-secret")"
export GITHUB_TOKEN="$("$GH_BIN" auth token)"
export GITHUB_REPOSITORY="GarrettPetersen/records-of-the-grand-historian"
export HOST="127.0.0.1"
export PORT="3001"
export GROKBOT_MCP_ALLOWED_HOSTS="grokbot-mcp.24histories.com"
export GROKBOT_MCP_BOOTSTRAP_FILE="$RUNTIME_ROOT/bootstrap.json"

if [[ ! -d "$PEOPLE_REPO_ROOT/.git" ]]; then
  print -u2 "Missing clean Grok Bot runtime clone: $PEOPLE_REPO_ROOT"
  exit 1
fi

exec "$NODE_BIN" "$SOURCE_ROOT/scripts/grokbot-mcp-server.mjs"

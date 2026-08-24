Exact-byte transfer for shiji/035 chunk outputs.

Raw JSON writes through the GitHub file API were landing the right size
with wrong bytes (CJK substitutions). These hex files are lowercase
UTF-8 hex of the local files, split at 8000 source bytes.

Reconstruct one file:
  cat NAME/*.hex | tr -d '\n' | xxd -r -p > NAME

Or with Node:
  node reconstruct.mjs

Source files live locally at /tmp/grokbot-transfer/shiji-035/
Assembled chapter file was not uploaded: data/people/extractions/shiji/035.json

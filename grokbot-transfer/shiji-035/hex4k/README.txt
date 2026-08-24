Exact-byte transfer for shiji/035, 4000-byte source slices.

Each NAME/NNN.hex is lowercase UTF-8 hex of 4000 source bytes
(last slice may be shorter), plus a trailing newline.

Reconstruct:
  cat NAME/*.hex | tr -d '\n' | xxd -r -p > NAME

Or: node reconstruct.mjs

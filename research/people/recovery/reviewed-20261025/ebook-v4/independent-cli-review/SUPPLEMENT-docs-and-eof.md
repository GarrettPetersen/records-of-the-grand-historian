# Independent supplement: process documentation and EOF-only normalization

The exact V4 patch remains sealed and untouched. This supplement independently approves the host's described temp-index-only removal of one final LF byte from each of `scripts/lib/ebook-people-render.mjs` and `scripts/lib/ebook-text.mjs`. The resulting file is exactly `sealedBytes[:-1]` in both cases; no JavaScript token or preceding byte changes. Both files retain their final newline. This has no JavaScript behavior effect, and no full-suite repeat is necessary. These are separately approved normalized bytes, not a claim that the resulting release patch still has the original V4 patch hash. Input seals must be regenerated through the ordinary compiler after adopted code bytes change.

Exact byte pins:

```json
[
  {
    "path": "scripts/lib/ebook-people-render.mjs",
    "sealedSha256": "241e94e02f74855d6acea49ab50fd0f858c2d19c78f0f1839238c4a423fe6da6",
    "normalizedSha256": "5c87587724fcd7054d5c78167321a337c75faab719db7a9fcbbbb1ef58f555a7",
    "removedBytes": 1,
    "removedSuffixHex": "0a"
  },
  {
    "path": "scripts/lib/ebook-text.mjs",
    "sealedSha256": "f835d2c66f126b5e7732bc2b38b3b7c8961323ce9ae197af7f0a9e791732d15b",
    "normalizedSha256": "d34d3dff9dcc4dbb55ace68895319180efa192b961a22535f0678913739b3fd9",
    "removedBytes": 1,
    "removedSuffixHex": "0a"
  }
]
```

Reviewed `PEOPLE_EBOOK_CERTIFICATION.draft.md` SHA256 `7db8aeff683456016bd8b8505e7f6e56e4c35e92e6f7b5868be0f149eb815dc1` against the reviewed compiler, qualifier, generator, verifier, manifest, and package commands. The documented Jinshu generator command and `dist/ebooks/jinshu/jinshu.epub` path match the current manifest's `jinshu` slug. Full-book completeness, manifest-ordered volume scopes, global identity reuse, scoped fact reconstruction, source/root binding, required-mode preview rejection and synthetic-vs-real-release limits agree with code.

Approve documentation after replacing “compiled catalog/index bytes” with “compiled catalog/index content”, as already proposed by the host. The digest checks reconstructed compiled content, not the physical serialized shard-file bytes. One optional precision improvement: say “any applied repairs against independent editorial decisions” instead of simply “independent editorial decisions”; chapters with no applied repairs are permitted without an editorial decision document. The current wording does not expressly claim every chapter needs such a document, so this is clarification rather than a blocker.

No other documentation correction or code finding. No canonical file, author-sealed artifact, Git index or branch was changed by this supplement.

# Independent V2 scope and provenance review

**Verdict: approved, no remaining findings in this review scope.** This approval is for V2 patch SHA-256 `832280f61b0d0c51e7a408528f1109d2cafccea3301356df85bd8beff364c872`, base `5d652c2cded7074ad5bfe3727cff639b1f07e1f1`. It is a fresh review of the V2 bytes and does not inherit V1 approval (V1 was changes requested).

Verified the V2 patch hash, every one of the 14 draft path hashes, and every non-null exact-base hash against the envelope. Independently verified V1 patch remains its original sealed hash. Read V2 changes to the actual loader, scope helper and Cloudflare handler, and the documented global URL identifier exception. Disk preflight passed at 50.85 GiB. No live code/canonical data/queue/date runtime/Git index/branch/checkout/paid calls/full build changes. This uniquely owned directory contains only authored fixtures, individual dependency files, proofs and generated tiny fixture outputs; no corpus or dependency tree was copied.

## Independently executed V1-blocker regression against V2

`provenance-proof.mjs` is adapted from this reviewer's retained V1 reproduction, imports the exact V2 source, and uses its own fixture. It does not simply trust the author's new test. `provenance-proof.log` retains the successful run (exit 0).

1. Build the ordinary real compiler catalog from two approved chapters plus 65 held chapters, including one cross-source identity cluster. Qualify only the two approved chapters and verify scoped display facts exclude the held source.
2. Remove all authored outside sources/extractions and the merge resolution, compile the two good chapters, and assert actual current certified context and global catalog are genuinely complete.
3. Load explicit preview while complete: assert `preview=true`, a current certificate exists, mode is `diagnostic-preview`, and published counts are zero.
4. Delete the independent date report for chapter001 without recompiling the global catalog. Default qualification now yields one chapter. Explicit preview likewise freshly projects only one and retains preview/zero-count diagnostic semantics.
5. Set `PEOPLE_SITE_PREVIEW=1` and run the actual generator. Assert `generated=1`, `published=false`, `preview=true`, and published chapter/people counts zero. Actual Cloudflare handler returns 503 for both approved and revoked-date person requests against those diagnostic shards.
6. Remove the preview environment setting and run actual default generation. Assert exactly one qualified person is published with `published=true`, `preview=false`; actual handler returns 200 for that current approved page and 404 for the revoked-date page.
7. Rewrite the approved fixture shard as v1 without certification, retaining its HTML, and assert actual handler rejects it with 503. There is no legacy uncertified transport fallback.

**The V1 preview promotion blocker is resolved.** Both diagnostic and production contexts now call fresh qualification. An old global completeness flag supplies no publication authority. The handler refuses diagnostic status and refuses all uncertified v1 transport.

## Other provenance conclusions

The independent proof also re-executes these assertions on V2:

- A self-attested cached certificate with empty gates is rejected by fresh reconstruction.
- Adding an unmentioned extra source sentence invalidates the identity seal before current qualification can publish it.
- With the held chapter lexically first, a merged person's display names and description remain scoped; no held alias is asserted as a name. The global URL retains its earlier lexical spelling, as explicitly authorized by the stable-global-ID/slug contract. V2 documentation states that opaque identifier exception; no neutral-URL migration or new identity policy is implied.
- The normal shortlist selects 2 of 67 current extracted chapters for full qualification without granting any gate from cached status. Missing/outdated date and unresolved identity hints exclude candidates, while full current validation determines acceptance. The complementary independent integration reviewer covers newly approved chapter inclusion and full CLI behavior separately.

Shared qualification still checks current extraction prompt, strict production extraction validation, explicit translation repair accounting, independent authorization of applied repairs, validation of every existing editorial history, full current independent date reports and reference pins, global identity ambiguity, and scoped reconstruction of public facts. No-repair/no-history acceptance remains the existing ebook policy. Ebook ordered product/whole-book manifest assertions remain unchanged in its wrapper. Source/extraction/editorial/date raw digests and fresh certificate reconstruction remain intact. V2 adds the old catalog publication-state/schema consistency check to the shared helper rather than losing it when removing the cached loader branch.

The author and complementary reviewer retain broader focused/integration suites; this report is specific independent provenance evidence. Approval does not itself perform adoption, full CI, a production build, deployment, or canonical publication, and does not replace those remaining required steps.

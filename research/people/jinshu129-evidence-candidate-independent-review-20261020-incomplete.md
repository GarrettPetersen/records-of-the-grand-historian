# Independent review: Jinshu 129 five-claim evidence candidate

Research only; **not** approval for canonical publication, a whole-chapter
editorial review, an independent date audit, or an identity decision. Reviewer:
Codex conversation `/root/jinshu129_target`, independent of the candidate
author `/root/claim_repair`. Review performed against staging revision
`f42bccc93524790f9d3a84dc03119185acfe6dab`.

## Inputs and exact scope

| Input | SHA-256 of bytes |
| --- | --- |
| `data/jinshu/129.json` | `bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800` |
| `data/people/extractions/jinshu/129.json` | `91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8` |
| `data/people/editorial-decisions/jinshu/129.json` | `ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2` |
| `research/people/jinshu129-evidence-candidate-20261020-incomplete.mjs` | `8558f0c62243b28dfa0e3ab3d8947b06340cecc661fede39c58015c90756a3d8` |
| `research/people/jinshu129-evidence-candidate-20261020-incomplete.json` | `245bef6e19358f7e470ca1771029bf5d7403bac9c710a7403b3bc2a28c2f5549` |

Independently compared the five declared compact-array changes against the
original and reversed them in memory; the restored candidate is deeply equal
to the original extraction. This establishes that no other extraction fields
changed, not that all retained claims are sound. Current local production code
passed strict compact validation and `validateAppliedEditorialDecisions` on
the candidate. Exact staging dependency parity was not established in this
review, so repeat those checks against the intended production revision.

## Five source findings

1. Original normalized **c0575**, male for Lü Chun, is removed. Its only
   evidence s0020 `執太守呂純以歸` names the governor and his capture but
   does not explicitly state sex. The removal does not assert that he was not
   male or preclude better independent evidence later.
2. Original **c0578**, male for Lü Hong, is removed. Its only evidence s0023
   `呂弘去張掖，將東走` names him and describes his departure and intended
   flight but does not explicitly state sex. This is likewise not a contrary
   assertion.
3. Original **c0658**, Mengxun's flooding and capture, retains its substantive
   value but changes from `explicit`/s0020 alone to `strongly-inferred` with
   s0016, s0017, s0019 and s0020. The flooding and capture are stated in
   s0020; the association with Xijun is contextual. The downgraded certainty
   appropriately distinguishes the combined assertion from a verbatim explicit
   statement. The resulting normalized ID is **c0656**.
4. Original **c0659**, Lü Chun's capture when Xijun fell, receives the same
   four supporting units and `strongly-inferred` certainty. The connection
   between the unnamed city in s0020 and Xijun arises from narrative continuity
   and is not explicitly repeated there. The resulting normalized ID is
   **c0657**.
5. Original **c0660**, Lü Chun's office, receives the same contextual evidence
   and `strongly-inferred` certainty. Its title changes from the reconstructed
   `西郡太守` / `Governor of Xijun` to directly attested `太守` / `Governor`;
   Xijun remains the contextually inferred jurisdiction. The resulting
   normalized ID is **c0658**. In s0016 Ye proposes the attack on Xijun;
   s0017 calls it this commandery; s0019 sends Mengxun; s0020 narrates the
   flooding and capture. Those passages support the inference but do not print
   the combined title.

The five changes are source-conservative and suitable for checkpointing as
explicitly incomplete research, subject to normal host verification. This is
not an independent approval of all other affected or unexamined claims.

## Claim-ID and downstream hazards

Compact normalization reassigns later sequential claim IDs. The independently
reviewed two-translation decision artifact targets original **c0669** for Lü
Hong's intended flight; that same retained claim is now **c0667**. Do not apply
the old decision to this candidate: regenerate its dossier and exact decision,
then independently review and validate it. Previously recorded editorial
history references also shift, for example **c1477 → c1475** and
**c1502 → c1500**. The local history validator accepted the current content,
but this does not verify every downstream consumer of positional IDs.

The candidate does not apply the separately proposed translations, settle
other evidence defects, or pass the remaining whole-chapter editorial, fresh
independent date, identity, site, ebook, and CI gates. Source and extraction
fingerprints must be reconciled before sealing downstream evidence. No
canonical file, claim, lock, Git state, worktree, or build was changed in this
review.

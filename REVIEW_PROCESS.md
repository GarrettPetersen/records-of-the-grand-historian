# Review Process

This project uses a manual editorial review pass for translated chapters. The goal is to improve translation quality without drifting away from the source text.

## When To Review

Review chapters that are translated but still need editorial cleanup. The manifest `reviewed` flag tracks chapters that have already been checked.

The quickest way to find the next chapter is:

```bash
make extract-next-review
```

To limit the search to one book:

```bash
make extract-next-review BOOK=shiji
```

## Review Loop

1. Extract the chapter for review.
2. Edit the generated review JSON by hand.
3. Apply the reviewed text back into the chapter.
4. Run the automated quality checks.
5. Mark the chapter reviewed in the manifest.

The usual commands are:

```bash
make extract-next-review
make apply-review CHAPTER=data/shiji/001.json
```

You can also extract a specific chapter directly:

```bash
make extract-review CHAPTER=data/shiji/024.json
```

## What Good Review Looks Like

A good review improves clarity and prose while preserving historical meaning.

Focus on:

- Semantic fidelity: keep the original meaning intact.
- Consistent proper nouns: use the same English form for names, offices, places, and titles across the chapter and, when possible, across the book.
- Flowing English prose: sentences should read naturally, not like a line-by-line gloss.
- Complete grammar: use proper articles, verb tense, and sentence structure.
- Tone discipline: keep the translation scholarly and restrained.
- Terminology consistency: preserve repeated technical terms, rank titles, ritual names, and institutional terms once a form is established.
- Punctuation and spacing: keep English punctuation clean and readable.

## Common Issues To Fix

- Literal translations that sound unnatural in English.
- Idiomatic translations that drift away from the source.
- Inconsistent names or titles inside the same chapter.
- Fragments that should be full sentences.
- English that is too terse, too ornate, or too modern for the passage.
- Leftover placeholders, empty fields, or Chinese characters in English text.

## After Applying Review

`make apply-review` now:

- applies the edited review JSON,
- recalculates translated sentence counts,
- runs the translation quality checks,
- marks the chapter reviewed in `data/manifest.json`,
- rebuilds the corresponding book.

If the chapter still needs work after the automated check, keep editing the review JSON and apply it again.

## Related Files

- [QUALITY_STANDARDS.md](./QUALITY_STANDARDS.md)
- [README.md](./README.md)
- [Makefile](./Makefile)


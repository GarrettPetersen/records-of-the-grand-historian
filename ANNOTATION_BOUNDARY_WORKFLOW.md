# Annotation Boundary Workflow

Some source texts use `〈...〉` to mark commentary, collation notes, editorial
insertions, table corrections, pronunciation glosses, or cross-references. The
translation pass often preserved the meaning but dropped the visible boundary,
which can make annotations read like main text.

## Goal

Preserve annotation/editorial boundaries when they clarify the text, without
blindly wrapping ordinary English sentences in angle brackets.

## Process

1. Scan a book for source annotation spans:

   ```sh
   make scan-annotations BOOK=<book> OPTIONS='--only-missing'
   make scan-annotations BOOK=<book> OPTIONS='--irregular'
   ```

2. Classify the source spans before fixing:
   - Later commentary or source quotation: usually preserve visible `〈...〉`.
   - Collation/pronunciation/geographic note: preserve the boundary when it is a
     standalone note; inline integration can be acceptable when the English is
     clearer.
   - Table correction, section label, or editorial marker: prefer natural
     English punctuation, often parentheses, unless visible angle brackets are
     necessary for readability.
   - Embedded source markers inside a main sentence must be reviewed manually.

3. Check source-marker position against English marker position:
   - Source starts with `〈`: English may start with `〈`, `[`, `(`, `<`, or a note label.
   - Source ends with `〉`: English may end with `〉`, `]`, `)`, or `>`.
   - Source marker is embedded/mid-row: English must not blindly put a marker at
     the start or end of the whole sentence.

4. Fix only rows where the boundary improves clarity or corrects alignment.
   Avoid changing unrelated translation wording.

5. Rebuild the affected book:

   ```sh
   make update BOOK=<book>
   ```

6. Verify again:
   - No missing source edge boundaries that should be preserved.
   - No irregular open spans or unbalanced closes.
   - No English start/end marker when the Chinese marker is embedded.
   - Book progress remains green.

## Checklist

### Completed

- [x] `sanguozhi` - Pei Songzhi commentary and source quotations restored and audited.
- [x] `hanshu` - Yan Shigu and other commentary audited; embedded notes reviewed.
- [x] `houhanshu` - Li Xian/commentarial notes audited; source irregularities fixed.
- [x] `songshi` - Editorial/table annotations audited; parentheses retained where clearer.
- [x] `yuanshi` - Calendrical, ritual, table, and office-rank notes audited.
- [x] `weishu` - Critical apparatus, geography notes, and source-supplied commentary audited.
- [x] `songshu` - Music-section labels, calendrical/table notes, omission markers, and geographic/editorial annotations audited.

### Not Yet Reviewed

- [ ] `jiuwudaishi`
- [ ] `mingshi`
- [ ] `jinshu`
- [ ] `xinwudaishi`
- [ ] `liaoshi`
- [ ] `nanqishu`
- [ ] `chenshu`
- [ ] `jinshi`
- [ ] `beishi`
- [ ] `jiutangshu`
- [ ] `liangshu`
- [ ] `qingshigao`
- [ ] `suishu`
- [ ] `xintangshu`

## Notes By Pattern

- `sanguozhi`, `hanshu`, and `houhanshu` contain substantial historical
  commentary. Visible annotation boundaries are usually appropriate.
- `songshi`, `yuanshi`, `mingshi`, `jiuwudaishi`, and `xinwudaishi` contain many
  editorial/table markers and bracketed corrections. These need more manual
  review; natural English parentheses may be better than literal angle brackets.
- `weishu`, `jinshu`, `songshu`, and `nanqishu` contain many geographic,
  administrative, pronunciation, and collation notes. Preserve boundaries for
  standalone notes, but do not force angle brackets into inline prose.

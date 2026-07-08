# Publication Descriptions

Edit one markdown file per book. Blank files produce an empty description.

Run this after editing:

```sh
make publication-descriptions
```

The command writes `ebooks/publication-descriptions.json`, converting normal markdown line breaks into JSON string newlines. Use blank lines between paragraphs.

To rebuild these markdown files from the JSON artifact:

```sh
make publication-descriptions-init
```

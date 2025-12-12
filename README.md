# Records of the Grand Historian

A web frontend for translated copies of the official 24 Dynastic Histories of China (二十四史), scraped from [chinesenotes.com](https://chinesenotes.com).

## The 24 Dynastic Histories

The Twenty-Four Histories are the Chinese official historical books covering Chinese history from approximately 3000 BCE to the Ming dynasty in the 17th century. They are:

1. **史記** (Shǐjì) - Records of the Grand Historian
2. **漢書** (Hànshū) - Book of Han
3. **後漢書** (Hòu Hànshū) - Book of Later Han
4. **三國志** (Sānguó Zhì) - Records of the Three Kingdoms
5. **晉書** (Jìnshū) - Book of Jin
6. **宋書** (Sòngshū) - Book of Song
7. **南齊書** (Nán Qíshū) - Book of Southern Qi
8. **梁書** (Liángshū) - Book of Liang
9. **陳書** (Chénshū) - Book of Chen
10. **魏書** (Wèishū) - Book of Wei
11. **北齊書** (Běi Qíshū) - Book of Northern Qi
12. **周書** (Zhōushū) - Book of Zhou
13. **隋書** (Suíshū) - Book of Sui
14. **南史** (Nánshǐ) - History of the Southern Dynasties
15. **北史** (Běishǐ) - History of the Northern Dynasties
16. **舊唐書** (Jiù Tángshū) - Old Book of Tang
17. **新唐書** (Xīn Tángshū) - New Book of Tang
18. **舊五代史** (Jiù Wǔdàishǐ) - Old History of the Five Dynasties
19. **新五代史** (Xīn Wǔdàishǐ) - New History of the Five Dynasties
20. **宋史** (Sòngshǐ) - History of Song
21. **遼史** (Liáoshǐ) - History of Liao
22. **金史** (Jīnshǐ) - History of Jin
23. **元史** (Yuánshǐ) - History of Yuan
24. **明史** (Míngshǐ) - History of Ming

## Setup

```bash
npm install
```

## Scraping

Use the `scrape.js` script to scrape any chapter from any of the 24 histories:

### List available books
```bash
node scrape.js --list
```

### Scrape a specific chapter
```bash
node scrape.js <book-id> <chapter>
```

**Examples:**
```bash
# Scrape chapter 1 of the Records of the Grand Historian
node scrape.js shiji 1

# Scrape chapter 369 of the History of Song
node scrape.js songshi 369

# Scrape chapter 24 of the History of Jin (with zero-padding)
node scrape.js jinshi 024
```

### Output format

The scraper outputs JSON with:
- `book`: Book identifier
- `bookInfo`: Name, Chinese characters, pinyin, and dynasty period
- `chapter`: Chapter number
- `url`: Source URL
- `title`: Chapter title (Chinese, English, and raw)
- `count`: Number of paragraphs extracted
- `paragraphs`: Array of Chinese text paragraphs
- `scrapedAt`: ISO 8601 timestamp

### Saving output

```bash
# Save to a file
mkdir -p data/scrapes
node scrape.js songshi 369 > data/scrapes/songshi369.json

# Save to organized directories
mkdir -p data/scrapes/songshi
node scrape.js songshi 369 > data/scrapes/songshi/369.json
```

## Source

Text is scraped from [Chinese Notes](https://chinesenotes.com), which provides English-Chinese parallel texts of classical Chinese literature.

## License

ISC

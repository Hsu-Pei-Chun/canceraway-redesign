# 爬蟲工具

需要先 `npm i playwright@1.49.1 && npx playwright install chromium`。

| 檔案 | 用途 |
|---|---|
| `nav.js` | 抓首頁主選單與頁尾結構 → `nav.json` |
| `crawl.js` | 從首頁開始逐頁爬整個網站（8–10 頁並行），輸出 `out/pages.json` 與截圖。`RESUME=1` 可從上次進度接續 |
| `extract.js` | 精準擷取 30 種癌症、主要單元頁與最新消息的內容 → `content.json` |

產出的 `nav.json`、`content.json` 放到 `src/data/`，再跑 `node src/build.js` 與 `node src/make-sitemap.js out/pages.json`。

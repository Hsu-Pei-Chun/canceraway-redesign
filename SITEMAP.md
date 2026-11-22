# 台灣癌症基金會 網站地圖（爬取結果）

> 來源：https://www.canceraway.org.tw/ ・ 以無頭瀏覽器（Playwright + Chromium）從首頁開始逐頁點擊爬取 ・ 爬取日期：2026-11-22
> 原網站沒有提供 sitemap.xml（回應 404），以下是實際爬過每一頁後整理出來的結構。

## 總覽

- 實際瀏覽的不重複頁面：**3097 頁**（已排除「友善列印」、「加入收藏」、舊版 .asp 轉址、網址多斜線等重複頁）
- 文件下載連結（PDF / Word 等）：411 個
- 另有子網站 **癌症e學苑** https://elearning.canceraway.org.tw/（癌友服務大多連過去），本次只爬主站，子網站列於選單結構中

| 頁面類型 | 頁數 |
|---|---:|
| 文章頁 | 2466 |
| 列表分頁 | 376 |
| 單元頁 / 文章列表 | 127 |
| 其他功能頁 | 44 |
| 分類目錄頁 | 41 |
| 癌症資訊頁 | 30 |
| 文件下載列表 | 5 |
| 出版品列表 | 4 |
| 課程列表 | 3 |
| 首頁 | 1 |

## 一、主選單結構（原網站）

### 台灣常見癌症

- [腦瘤](https://www.canceraway.org.tw/cancerinfo.php?id=FD3596B7-8FF1-4E64-9ED2-89EE6DB0B336)
- [喉癌](https://www.canceraway.org.tw/cancerinfo.php?id=0125AF91-A66E-4F66-A8AB-D553592CD5B4)
- [鼻咽癌](https://www.canceraway.org.tw/cancerinfo.php?id=EFD1921A-2D32-4299-BC74-805912FB994C)
- [口腔癌](https://www.canceraway.org.tw/cancerinfo.php?id=D0052AC3-BE9A-46BC-B9F4-164FF14F3BF9)
- [食道癌](https://www.canceraway.org.tw/cancerinfo.php?id=EDB4D1DE-D91A-4833-A8F1-695CD3310C65)
- [甲狀腺癌](https://www.canceraway.org.tw/cancerinfo.php?id=ACF3F741-024F-425C-B3C4-9C4F83F3A34A)
- [肺癌](https://www.canceraway.org.tw/cancerinfo.php?id=BCD03185-BCBC-4CE2-A7E1-EBF798161CAA)
- [乳癌](https://www.canceraway.org.tw/cancerinfo.php?id=EC4BC652-18B3-464C-B19D-CB0C49C64285)
- [胃癌](https://www.canceraway.org.tw/cancerinfo.php?id=624DAB1F-5B43-433D-AA23-77AB3A90AC0D)
- [腸胃道間質瘤](https://www.canceraway.org.tw/cancerinfo.php?id=7E750EF3-B2B2-4F75-AD16-5DABB5C004E9)
- [肝癌](https://www.canceraway.org.tw/cancerinfo.php?id=080BA4E2-B4FA-4177-9C00-B7D224347130)
- [膽囊膽管癌](https://www.canceraway.org.tw/cancerinfo.php?id=1246ABD0-D2AC-41D4-AED3-1375EA8AB640)
- [胰臟癌](https://www.canceraway.org.tw/cancerinfo.php?id=EB0C9F56-5679-4647-9450-CCBD29435E10)
- [大腸直腸癌](https://www.canceraway.org.tw/cancerinfo.php?id=633D2D44-EC10-49BD-B7CF-E05EF6F7623A)
- [攝護腺癌](https://www.canceraway.org.tw/cancerinfo.php?id=B4202C4F-D7E6-4DF8-B5A3-A23947973BAF)
- [卵巢癌](https://www.canceraway.org.tw/cancerinfo.php?id=C2256245-D562-4AEE-A195-8DB1A1DA7EAA)
- [輸卵管癌](https://www.canceraway.org.tw/cancerinfo.php?id=81EF0741-6F67-45FD-B7AD-1CDF7997E0A6)
- [子宮內膜癌](https://www.canceraway.org.tw/cancerinfo.php?id=74E28B78-BC13-4AC0-AD00-47ABEC6F1972)
- [子宮頸癌](https://www.canceraway.org.tw/cancerinfo.php?id=DDE2E036-9595-4162-A872-5B27A1243C3F)
- [陰道癌](https://www.canceraway.org.tw/cancerinfo.php?id=6B7618FE-9EF2-4CC2-B4F3-513A00E5C8D1)
- [腎臟癌](https://www.canceraway.org.tw/cancerinfo.php?id=976EC61E-CC3E-4C25-A5A6-A44C490229A4)
- [膀胱癌](https://www.canceraway.org.tw/cancerinfo.php?id=9B3B7F46-B5BC-442E-A8BE-0176B544C6E4)
- [皮膚癌](https://www.canceraway.org.tw/cancerinfo.php?id=65F0883B-8992-4C2E-90B6-9262B32408F2)
- [多發性骨髓瘤](https://www.canceraway.org.tw/cancerinfo.php?id=F27F22C4-E6B1-47DE-A04B-D4908F4F1BE2)
- [淋巴癌](https://www.canceraway.org.tw/cancerinfo.php?id=CCAEC6A5-9CEF-4922-8010-D36DA898E905)
- [急性骨髓性白血病](https://www.canceraway.org.tw/cancerinfo.php?id=b759d08a-417e-6ae6-ca83-fe958e9c2f0a)
- [慢性骨髓性白血病](https://www.canceraway.org.tw/cancerinfo.php?id=c5b661c5-a238-8f79-8bff-da91597a6e49)
- [急性淋巴性白血病](https://www.canceraway.org.tw/cancerinfo.php?id=AD2E8345-BA5B-4FA8-A3DC-84A6478719AF)
- [慢性淋巴性白血病](https://www.canceraway.org.tw/cancerinfo.php?id=fe2af294-90f0-d535-0bc9-4c0db32b5818)
- [骨癌](https://www.canceraway.org.tw/cancerinfo.php?id=175A7FE8-2341-4CFF-8111-C8C1C4C39A04)

### 癌症預防

- [蔬果彩虹579](https://www.canceraway.org.tw/catalog.php?keyid=50)
- [規律運動](https://www.canceraway.org.tw/catalog.php?keyid=51)
- [體重控制](https://www.canceraway.org.tw/catalog.php?keyid=52)
- [遠離菸檳](https://www.canceraway.org.tw/catalog.php?keyid=53)
- [定期篩檢](https://www.canceraway.org.tw/catalog.php?keyid=54)
- [防癌小博士](https://www.canceraway.org.tw/pagelist.php?keyid=292)
- [預防活動資訊](https://www.canceraway.org.tw/catalink.php?keyid=21)
- [防癌小常識](https://www.canceraway.org.tw/pagelist.php?keyid=55)

### 癌症e學苑(癌友服務)

- **自我照護管理**
- [醫療新知](https://elearning.canceraway.org.tw/pagelist.php?keyid=239)
- [癌症照護](https://elearning.canceraway.org.tw/pagelist.php?keyid=240)
- [癌症營養](https://elearning.canceraway.org.tw/catalog.php?keyid=241)
- [心理支持](https://elearning.canceraway.org.tw/catalog.php?keyid=242)
- [復健運動](https://elearning.canceraway.org.tw/pagelist.php?keyid=81)
- [免疫治療](https://elearning.canceraway.org.tw/pagelist.php?keyid=280)
- **身心靈康復課程**
- [北部課程](https://www.canceraway.org.tw/classlist.php?keyid=95)
- [南部課程](https://www.canceraway.org.tw/classlist.php?keyid=96)
- [跨院際講座](https://www.canceraway.org.tw/classlist.php?keyid=126)
- **病友支持團體**
- [肺腑之癌](https://elearning.canceraway.org.tw/pagelist.php?keyid=45)
- [腸相挺](https://elearning.canceraway.org.tw/pagelist.php?keyid=44)
- [笑顏逐開](https://elearning.canceraway.org.tw/pagelist.php?keyid=46)
- [悅聲合唱團](https://elearning.canceraway.org.tw/pagelist.php?keyid=47)
- [愛care之友](https://elearning.canceraway.org.tw/pagelist.php?keyid=41)
- [午茶話療](https://elearning.canceraway.org.tw/pagelist.php?keyid=102)
- [抗癌鬥士](https://www.canceraway.org.tw/pagelist.php?keyid=103)
- **癌症病友補助**
- [營養品補助](https://elearning.canceraway.org.tw/pagelist.php?keyid=233)
- [經濟補助](https://elearning.canceraway.org.tw/pagelist.php?keyid=97)
- [交通補助](https://elearning.canceraway.org.tw/pagelist.php?keyid=101)
- [居家喘息](https://elearning.canceraway.org.tw/pagelist.php?keyid=234)
- [心理諮商](https://elearning.canceraway.org.tw/pagelist.php?keyid=98)
- [癌症保險諮詢](https://elearning.canceraway.org.tw/pagelist.php?keyid=278)
- [假髮租借](https://elearning.canceraway.org.tw/pagelist.php?keyid=99)
- [專業諮詢服務](https://elearning.canceraway.org.tw/pagelist.php?keyid=281)
- [安心窩-遠距就醫服務](https://elearning.canceraway.org.tw/pagelist.php?keyid=295)
- [線上諮詢](https://www.canceraway.org.tw/QA-index.php)
- [數位教學平台](https://elearning.canceraway.org.tw/catalog.php?keyid=198)
- [直播小教室](https://elearning.canceraway.org.tw/videolist.php?keyid=232)
- [台灣藥物臨床試驗資訊](https://www.taiwanclinicaltrials.tw/tw/news)
- [癌友關懷教育中心](https://www.canceraway.org.tw/catalog.php?keyid=12)

### 癌友權益促進

- [最新消息](https://www.canceraway.org.tw/pagelist.php?keyid=305)

### 捐款與支持

- [捐款方式](https://www.canceraway.org.tw/donate.php)
- [線上捐款](https://www.canceraway.org.tw/donateform.php)
- [捐款芳名錄](https://www.canceraway.org.tw/pagelist.php?keyid=94)
- [勸募專區](https://www.canceraway.org.tw/pagelist.php?keyid=92)
- [愛心義賣](https://www.canceraway.org.tw/publish.php?keyid=93)
- [志工招募](https://www.canceraway.org.tw/pagelist.php?keyid=89)
- [企業參與](https://www.canceraway.org.tw/pagelist.php?keyid=88)

### 台癌圖書館

- [圖書出版](https://www.canceraway.org.tw/publish.php?keyid=29)
- [其他出版](https://www.canceraway.org.tw/publish.php?keyid=31)
- [會訊下載](https://www.canceraway.org.tw/doclist.php?keyid=32)
- [各項專業調查](https://www.canceraway.org.tw/doclist.php?keyid=35)
- [衛教手冊&懶人包](https://www.canceraway.org.tw/doclist.php?keyid=294)

### 關於基金會

- [基金會緣起](https://www.canceraway.org.tw/pagelist.php?keyid=18)
- [宗旨與目標](https://www.canceraway.org.tw/pagelist.php?keyid=22)
- [服務項目](https://www.canceraway.org.tw/pagelist.php?keyid=6)
- [組織架構](https://www.canceraway.org.tw/pagelist.php?keyid=23)
- [最新消息](https://www.canceraway.org.tw/pagelist.php?keyid=1)
- [媒體報導](https://www.canceraway.org.tw/pagelist.php?keyid=2)
- [榮耀共享](https://www.canceraway.org.tw/pagelist.php?keyid=26)
- [年度報告](https://www.canceraway.org.tw/doclist.php?keyid=125)

### 全民練5功

- [規律運動](https://www.canceraway.org.tw/catalog.php?keyid=51)
- [體重控制](https://www.canceraway.org.tw/catalog.php?keyid=52)
- [遠離菸檳](https://www.canceraway.org.tw/catalog.php?keyid=53)
- [定期篩檢](https://www.canceraway.org.tw/catalog.php?keyid=54)
- [防癌小博士](https://www.canceraway.org.tw/pagelist.php?keyid=292)

### 癌友服務

- [醫療新知](https://elearning.canceraway.org.tw/pagelist.php?keyid=239)
- [癌症照護](https://elearning.canceraway.org.tw/pagelist.php?keyid=240)
- [癌症營養](https://elearning.canceraway.org.tw/catalog.php?keyid=241)
- [心理支持](https://elearning.canceraway.org.tw/catalog.php?keyid=242)
- [復健運動](https://elearning.canceraway.org.tw/pagelist.php?keyid=81)
- [免疫治療](https://elearning.canceraway.org.tw/pagelist.php?keyid=280)
- [北部課程](https://www.canceraway.org.tw/classlist.php?keyid=95)
- [南部課程](https://www.canceraway.org.tw/classlist.php?keyid=96)
- [跨院際講座](https://www.canceraway.org.tw/classlist.php?keyid=126)
- [肺腑之癌](https://elearning.canceraway.org.tw/pagelist.php?keyid=45)
- [腸相挺](https://elearning.canceraway.org.tw/pagelist.php?keyid=44)
- [笑顏逐開](https://elearning.canceraway.org.tw/pagelist.php?keyid=46)
- [悅聲合唱團](https://elearning.canceraway.org.tw/pagelist.php?keyid=47)
- [愛care之友](https://elearning.canceraway.org.tw/pagelist.php?keyid=41)
- [午茶話療](https://elearning.canceraway.org.tw/pagelist.php?keyid=102)
- [抗癌鬥士](https://www.canceraway.org.tw/pagelist.php?keyid=103)
- [營養品補助](https://elearning.canceraway.org.tw/pagelist.php?keyid=233)
- [經濟補助](https://elearning.canceraway.org.tw/pagelist.php?keyid=97)
- [交通補助](https://elearning.canceraway.org.tw/pagelist.php?keyid=101)
- [居家喘息](https://elearning.canceraway.org.tw/pagelist.php?keyid=234)
- [心理諮商](https://elearning.canceraway.org.tw/pagelist.php?keyid=98)
- [癌症保險諮詢](https://elearning.canceraway.org.tw/pagelist.php?keyid=278)
- [假髮租借](https://elearning.canceraway.org.tw/pagelist.php?keyid=99)
- [專業諮詢服務](https://elearning.canceraway.org.tw/pagelist.php?keyid=281)
- [安心窩-遠距就醫服務](https://elearning.canceraway.org.tw/pagelist.php?keyid=295)
- [線上諮詢](https://www.canceraway.org.tw/QA-index.php)
- [數位教學平台](https://elearning.canceraway.org.tw/catalog.php?keyid=198)
- [直播小教室](https://elearning.canceraway.org.tw/videolist.php?keyid=232)
- [台灣藥物臨床試驗資訊](https://www.taiwanclinicaltrials.tw/tw/news)
- [癌友關懷教育中心](https://www.canceraway.org.tw/catalog.php?keyid=12)

### 支持我們

- [志工招募](https://www.canceraway.org.tw/pagelist.php?keyid=89)
- [企業參與](https://www.canceraway.org.tw/pagelist.php?keyid=88)

### 基金會介紹

- [基金會緣起](https://www.canceraway.org.tw/pagelist.php?keyid=18)
- [宗旨與目標](https://www.canceraway.org.tw/pagelist.php?keyid=22)
- [服務項目](https://www.canceraway.org.tw/pagelist.php?keyid=6)
- [組織架構](https://www.canceraway.org.tw/pagelist.php?keyid=23)

### 頁尾

- 首頁、關於基金會、網站服務條款（pagelist.php?keyid=235）、線上聯絡（QA-index.php）、訂閱電子報

## 二、分類目錄頁（catalog.php，41 頁）

| keyid | 標題 | 網址 |
|---:|---|---|
| 3 | 基金會簡介 | https://www.canceraway.org.tw/catalog.php?keyid=3 |
| 4 | 榮耀共享 | https://www.canceraway.org.tw/catalog.php?keyid=4 |
| 8 | 出版品 | https://www.canceraway.org.tw/catalog.php?keyid=8 |
| 10 | 癌症預防 | https://www.canceraway.org.tw/catalog.php?keyid=10 |
| 11 | 癌症資訊 | https://www.canceraway.org.tw/catalog.php?keyid=11 |
| 12 | 癌友關懷教育中心 | https://www.canceraway.org.tw/catalog.php?keyid=12 |
| 13 | 關懷與捐款 | https://www.canceraway.org.tw/catalog.php?keyid=13 |
| 14 | 加入我們 | https://www.canceraway.org.tw/catalog.php?keyid=14 |
| 15 | 關於我們 | https://www.canceraway.org.tw/catalog.php?keyid=15 |
| 16 | 組織架構 | https://www.canceraway.org.tw/catalog.php?keyid=16 |
| 33 | 台灣常見癌症 | https://www.canceraway.org.tw/catalog.php?keyid=33 |
| 39 | 癌症家庭扶持 | https://www.canceraway.org.tw/catalog.php?keyid=39 |
| 43 | 病友支持團體 | https://www.canceraway.org.tw/catalog.php?keyid=43 |
| 48 | 抗癌鬥士 | https://www.canceraway.org.tw/catalog.php?keyid=48 |
| 50 | 蔬果彩虹579 | https://www.canceraway.org.tw/catalog.php?keyid=50 |
| 51 | 規律運動 | https://www.canceraway.org.tw/catalog.php?keyid=51 |
| 52 | 體重控制 | https://www.canceraway.org.tw/catalog.php?keyid=52 |
| 53 | 遠離菸檳 | https://www.canceraway.org.tw/catalog.php?keyid=53 |
| 54 | 定期篩檢 | https://www.canceraway.org.tw/catalog.php?keyid=54 |
| 105 | 歷屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/catalog.php?keyid=105 |
| 197 | 數位教學平台 | https://www.canceraway.org.tw/catalog.php?keyid=197 |
| 198 | 營養指導 | https://www.canceraway.org.tw/catalog.php?keyid=198 |
| 199 | 復健運動 | https://www.canceraway.org.tw/catalog.php?keyid=199 |
| 200 | 心理支持 | https://www.canceraway.org.tw/catalog.php?keyid=200 |
| 201 | 專題演講 | https://www.canceraway.org.tw/catalog.php?keyid=201 |
| 202 | 治療準備期 | https://www.canceraway.org.tw/catalog.php?keyid=202 |
| 203 | 治療期間飲食建議 | https://www.canceraway.org.tw/catalog.php?keyid=203 |
| 204 | 治療不適症（副作用）因應對策 | https://www.canceraway.org.tw/catalog.php?keyid=204 |
| 205 | 康復後的飲食 | https://www.canceraway.org.tw/catalog.php?keyid=205 |
| 211 | 心情感受停看聽 | https://www.canceraway.org.tw/catalog.php?keyid=211 |
| 225 | 營養食譜 | https://www.canceraway.org.tw/catalog.php?keyid=225 |
| 226 | 高熱量料理 | https://www.canceraway.org.tw/catalog.php?keyid=226 |
| 227 | 高纖料理 | https://www.canceraway.org.tw/catalog.php?keyid=227 |
| 228 | 高蛋白料理 | https://www.canceraway.org.tw/catalog.php?keyid=228 |
| 236 | 癌症家庭扶助 | https://www.canceraway.org.tw/catalog.php?keyid=236 |
| 238 | 自我照護管理 | https://www.canceraway.org.tw/catalog.php?keyid=238 |
| 241 | 癌症營養 | https://www.canceraway.org.tw/catalog.php?keyid=241 |
| 242 | 心理支持 | https://www.canceraway.org.tw/catalog.php?keyid=242 |
| 288 | 預防活動資訊 | https://www.canceraway.org.tw/catalog.php?keyid=288 |
| 291 | 全民練5功 | https://www.canceraway.org.tw/catalog.php?keyid=291 |
| 304 | 癌友權益促進 | https://www.canceraway.org.tw/catalog.php?keyid=304 |

## 三、單元頁與文章列表（pagelist.php，127 個單元）

| keyid | 標題 | 網址 |
|---:|---|---|
| 1 | 最新消息 | https://www.canceraway.org.tw/pagelist.php?keyid=1 |
| 2 | 媒體報導 | https://www.canceraway.org.tw/pagelist.php?keyid=2 |
| 5 | 兩岸/國際交流 | https://www.canceraway.org.tw/pagelist.php?keyid=5 |
| 6 | 服務項目 | https://www.canceraway.org.tw/pagelist.php?keyid=6 |
| 18 | 基金會緣起 | https://www.canceraway.org.tw/pagelist.php?keyid=18 |
| 22 | 宗旨與目標 | https://www.canceraway.org.tw/pagelist.php?keyid=22 |
| 23 | 基金會組織圖 | https://www.canceraway.org.tw/pagelist.php?keyid=23 |
| 24 | 董監事名單 | https://www.canceraway.org.tw/pagelist.php?keyid=24 |
| 25 | 醫療顧問 | https://www.canceraway.org.tw/pagelist.php?keyid=25 |
| 26 | 榮耀共享 | https://www.canceraway.org.tw/pagelist.php?keyid=26 |
| 27 | 名人見證分享 | https://www.canceraway.org.tw/pagelist.php?keyid=27 |
| 28 | 年度傳愛大使 | https://www.canceraway.org.tw/pagelist.php?keyid=28 |
| 29 | 圖書出版 | https://www.canceraway.org.tw/pagelist.php?keyid=29 |
| 30 | 影音出版 | https://www.canceraway.org.tw/pagelist.php?keyid=30 |
| 31 | 其他出版 | https://www.canceraway.org.tw/pagelist.php?keyid=31 |
| 32 | 會訊下載 | https://www.canceraway.org.tw/pagelist.php?keyid=32 |
| 34 | 癌症治療最新文章 | https://www.canceraway.org.tw/pagelist.php?keyid=34 |
| 35 | 各項專業調查 | https://www.canceraway.org.tw/pagelist.php?keyid=35 |
| 36 | 臨床試驗 | https://www.canceraway.org.tw/pagelist.php?keyid=36 |
| 37 | 醫病之間 | https://www.canceraway.org.tw/pagelist.php?keyid=37 |
| 41 | 愛．Care之友 | https://www.canceraway.org.tw/pagelist.php?keyid=41 |
| 44 | 腸相挺聯誼會 | https://www.canceraway.org.tw/pagelist.php?keyid=44 |
| 45 | 肺腑之癌聯誼會 | https://www.canceraway.org.tw/pagelist.php?keyid=45 |
| 46 | 笑癌逐開社 | https://www.canceraway.org.tw/pagelist.php?keyid=46 |
| 47 | 悅聲合唱團 | https://www.canceraway.org.tw/pagelist.php?keyid=47 |
| 55 | 防癌小常識 | https://www.canceraway.org.tw/pagelist.php?keyid=55 |
| 62 | 乳癌 | https://www.canceraway.org.tw/pagelist.php?keyid=62 |
| 63 | 胃癌 | https://www.canceraway.org.tw/pagelist.php?keyid=63 |
| 71 | 輸卵管癌 | https://www.canceraway.org.tw/pagelist.php?keyid=71 |
| 72 | 子宮內膜癌 | https://www.canceraway.org.tw/pagelist.php?keyid=72 |
| 73 | 子宮頸癌 | https://www.canceraway.org.tw/pagelist.php?keyid=73 |
| 74 | 陰道癌 | https://www.canceraway.org.tw/pagelist.php?keyid=74 |
| 75 | 腎臟癌 | https://www.canceraway.org.tw/pagelist.php?keyid=75 |
| 76 | 膀胱癌 | https://www.canceraway.org.tw/pagelist.php?keyid=76 |
| 77 | 皮膚癌 | https://www.canceraway.org.tw/pagelist.php?keyid=77 |
| 78 | 多發性骨髓瘤 | https://www.canceraway.org.tw/pagelist.php?keyid=78 |
| 79 | 血癌 | https://www.canceraway.org.tw/pagelist.php?keyid=79 |
| 80 | 淋巴瘤 | https://www.canceraway.org.tw/pagelist.php?keyid=80 |
| 81 | 復健運動 | https://www.canceraway.org.tw/pagelist.php?keyid=81 |
| 86 | 個人 | https://www.canceraway.org.tw/pagelist.php?keyid=86 |
| 87 | 學校/團體 | https://www.canceraway.org.tw/pagelist.php?keyid=87 |
| 88 | 企業 | https://www.canceraway.org.tw/pagelist.php?keyid=88 |
| 89 | 加入志工 | https://www.canceraway.org.tw/pagelist.php?keyid=89 |
| 90 | 親愛的捐款人 您好， | https://www.canceraway.org.tw/pagelist.php?keyid=90 |
| 92 | 勸募專區 | https://www.canceraway.org.tw/pagelist.php?keyid=92 |
| 93 | 愛心義賣 | https://www.canceraway.org.tw/pagelist.php?keyid=93 |
| 94 | 捐款芳名錄 | https://www.canceraway.org.tw/pagelist.php?keyid=94 |
| 95 | 北部身心靈康復課程 | https://www.canceraway.org.tw/pagelist.php?keyid=95 |
| 96 | 南部身心靈康復課程 | https://www.canceraway.org.tw/pagelist.php?keyid=96 |
| 97 | 經濟補助 | https://www.canceraway.org.tw/pagelist.php?keyid=97 |
| 98 | 心理諮商 | https://www.canceraway.org.tw/pagelist.php?keyid=98 |
| 99 | 假髮租借 | https://www.canceraway.org.tw/pagelist.php?keyid=99 |
| 101 | 就醫交通補助 | https://www.canceraway.org.tw/pagelist.php?keyid=101 |
| 102 | 午茶話聊聚會 | https://www.canceraway.org.tw/pagelist.php?keyid=102 |
| 103 | 抗癌鬥士緣起 | https://www.canceraway.org.tw/pagelist.php?keyid=103 |
| 104 | 歷屆名單 | https://www.canceraway.org.tw/pagelist.php?keyid=104 |
| 113 | 影片分享 | https://www.canceraway.org.tw/pagelist.php?keyid=113 |
| 114 | 第一屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=114 |
| 115 | 第二屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=115 |
| 116 | 第三屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=116 |
| 117 | 第四屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=117 |
| 118 | 第五屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=118 |
| 119 | 骨癌 | https://www.canceraway.org.tw/pagelist.php?keyid=119 |
| 120 | 關於菸害 | https://www.canceraway.org.tw/pagelist.php?keyid=120 |
| 121 | 戒菸撇步 | https://www.canceraway.org.tw/pagelist.php?keyid=121 |
| 122 | 菸害防制 | https://www.canceraway.org.tw/pagelist.php?keyid=122 |
| 123 | 友好連結 | https://www.canceraway.org.tw/pagelist.php?keyid=123 |
| 124 | 第六屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=124 |
| 125 | 年度報告 | https://www.canceraway.org.tw/pagelist.php?keyid=125 |
| 126 | 跨院際巡迴講座 | https://www.canceraway.org.tw/pagelist.php?keyid=126 |
| 127 | 第七屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=127 |
| 128 | 第八屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=128 |
| 129 | 第九屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=129 |
| 131 | 第十屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=131 |
| 171 | 兒童肥胖 | https://www.canceraway.org.tw/pagelist.php?keyid=171 |
| 172 | 生活中的肥胖因子 | https://www.canceraway.org.tw/pagelist.php?keyid=172 |
| 173 | 聰明吃健康瘦 | https://www.canceraway.org.tw/pagelist.php?keyid=173 |
| 174 | 肥胖與癌症 | https://www.canceraway.org.tw/pagelist.php?keyid=174 |
| 193 | 居家微運動 | https://www.canceraway.org.tw/pagelist.php?keyid=193 |
| 233 | 癌友營養品補助 | https://www.canceraway.org.tw/pagelist.php?keyid=233 |
| 234 | 居家喘息 | https://www.canceraway.org.tw/pagelist.php?keyid=234 |
| 235 | 隱私政策 | https://www.canceraway.org.tw/pagelist.php?keyid=235 |
| 239 | 醫療新知 | https://www.canceraway.org.tw/pagelist.php?keyid=239 |
| 240 | 癌症照護 | https://www.canceraway.org.tw/pagelist.php?keyid=240 |
| 244 | 治療前準備期 | https://www.canceraway.org.tw/pagelist.php?keyid=244 |
| 245 | 治療期間飲食建議 | https://www.canceraway.org.tw/pagelist.php?keyid=245 |
| 246 | 治療前/後不適症 | https://www.canceraway.org.tw/pagelist.php?keyid=246 |
| 247 | 康復後的飲食 | https://www.canceraway.org.tw/pagelist.php?keyid=247 |
| 248 | 破除營養迷思 | https://www.canceraway.org.tw/pagelist.php?keyid=248 |
| 249 | 心情感受停看聽 | https://www.canceraway.org.tw/pagelist.php?keyid=249 |
| 250 | 壓力調適策略 | https://www.canceraway.org.tw/pagelist.php?keyid=250 |
| 251 | 家庭溝通安心講 | https://www.canceraway.org.tw/pagelist.php?keyid=251 |
| 252 | 照顧者深呼吸 | https://www.canceraway.org.tw/pagelist.php?keyid=252 |
| 256 | 會員條款 | https://www.canceraway.org.tw/pagelist.php?keyid=256 |
| 257 | 第十一屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=257 |
| 278 | 癌症保險諮詢 | https://www.canceraway.org.tw/pagelist.php?keyid=278 |
| 279 | 影片分享 | https://www.canceraway.org.tw/pagelist.php?keyid=279 |
| 280 | 免疫治療 | https://www.canceraway.org.tw/pagelist.php?keyid=280 |
| 281 | 專業諮詢服務 | https://www.canceraway.org.tw/pagelist.php?keyid=281 |
| 285 | 基本運動概念 | https://www.canceraway.org.tw/pagelist.php?keyid=285 |
| 286 | 我的運動手冊 | https://www.canceraway.org.tw/pagelist.php?keyid=286 |
| 289 | 免費五癌篩檢 | https://www.canceraway.org.tw/pagelist.php?keyid=289 |
| 290 | 其他常見癌別 | https://www.canceraway.org.tw/pagelist.php?keyid=290 |
| 292 | 防癌小博士 | https://www.canceraway.org.tw/pagelist.php?keyid=292 |
| 294 | 衛教手冊&懶人包 | https://www.canceraway.org.tw/pagelist.php?keyid=294 |
| 295 | 安心窩-遠距就醫住宿服務 | https://www.canceraway.org.tw/pagelist.php?keyid=295 |
| 296 | 掌握4要點 增進親密關係與溝通 | https://www.canceraway.org.tw/pagelist.php?keyid=296 |
| 297 | 癌友攪打飲食調理 | https://www.canceraway.org.tw/pagelist.php?keyid=297 |
| 299 | 癌友防疫 | https://www.canceraway.org.tw/pagelist.php?keyid=299 |
| 300 | 法律扶助 | https://www.canceraway.org.tw/pagelist.php?keyid=300 |
| 301 | 專屬癌友料理配方 | https://www.canceraway.org.tw/pagelist.php?keyid=301 |
| 305 | 最新消息 | https://www.canceraway.org.tw/pagelist.php?keyid=305 |
| 306 | 介紹TmCDF | https://www.canceraway.org.tw/pagelist.php?keyid=306 |
| 307 | 研究成果 | https://www.canceraway.org.tw/pagelist.php?keyid=307 |
| 308 | 病友心聲 | https://www.canceraway.org.tw/pagelist.php?keyid=308 |
| 309 | 第十二屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=309 |
| 310 | 第十三屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=310 |
| 311 | 第十四屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=311 |
| 312 | 第十五屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=312 |
| 314 | 營養食譜 | https://www.canceraway.org.tw/pagelist.php?keyid=314 |
| 316 | 第十六屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=316 |
| 317 | 基因檢測補助 | https://www.canceraway.org.tw/pagelist.php?keyid=317 |
| 318 | 預約心理諮商 | https://www.canceraway.org.tw/pagelist.php?keyid=318 |
| 319 | 第十七屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=319 |
| 320 | 第十八屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=320 |
| 321 | 第十九屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=321 |
| 322 | 第二十屆抗癌鬥士代表故事 | https://www.canceraway.org.tw/pagelist.php?keyid=322 |

## 四、其他功能頁

| 頁面 | 標題 | 網址 |
|---|---|---|
| /catalink.php | 預防活動資訊 | https://www.canceraway.org.tw/catalink.php?keyid=21 |
| /classlist.php | 北部身心靈康復課程 | https://www.canceraway.org.tw/classlist.php?keyid=95 |
| /classlist.php | 南部身心靈康復課程 | https://www.canceraway.org.tw/classlist.php?keyid=96 |
| /classlist.php | 跨院際巡迴講座 | https://www.canceraway.org.tw/classlist.php?keyid=126 |
| /QA-index.php | 線上諮詢 | https://www.canceraway.org.tw/QA-index.php |
| /donateform.php | 本次捐款金額(NTD) | https://www.canceraway.org.tw/donateform.php |
| /publish.php | 愛心義賣 | https://www.canceraway.org.tw/publish.php?keyid=93 |
| /donate.php | 親愛的捐款人 您好， | https://www.canceraway.org.tw/donate.php |
| /publish.php | 圖書出版 | https://www.canceraway.org.tw/publish.php?keyid=29 |
| /publish.php | 其他出版 | https://www.canceraway.org.tw/publish.php?keyid=31 |
| /doclist.php | 各項專業調查 | https://www.canceraway.org.tw/doclist.php?keyid=35 |
| /doclist.php | 會訊下載 | https://www.canceraway.org.tw/doclist.php?keyid=32 |
| /doclist.php | 衛教手冊&懶人包 | https://www.canceraway.org.tw/doclist.php?keyid=294 |
| /doclist.php | 年度報告 | https://www.canceraway.org.tw/doclist.php?keyid=125 |
| /search.php | 訂閱電子報 | https://www.canceraway.org.tw/search.php |
| /search.php | 訂閱電子報 | https://www.canceraway.org.tw/search.php?q=%E6%8A%97%E7%99%8C%E9%AC%A5%E5%A3%AB |
| /search.php | 訂閱電子報 | https://www.canceraway.org.tw/search.php?q=%E8%83%83%E7%99%8C |
| /search.php | 訂閱電子報 | https://www.canceraway.org.tw/search.php?q=%E5%85%A8%E6%B0%91%E7%B7%B4%E4%BA%94%E5%8A%9F |
| /search.php | 訂閱電子報 | https://www.canceraway.org.tw/search.php?q=%E5%AD%90%E5%AE%AE%E9%A0%B8%E7%99%8C |
| /search.php | 訂閱電子報 | https://www.canceraway.org.tw/search.php?q=%E7%B2%89%E7%B4%85%E5%81%A5%E8%B5%B0 |
| /events/subscription/ | 訂閱電子報 | https://www.canceraway.org.tw/events/subscription/ |
| /doclist.php | 捐款芳名錄 | https://www.canceraway.org.tw/doclist.php?keyid=94 |
| /publish.php | 影音出版 | https://www.canceraway.org.tw/publish.php?keyid=30 |
| /colorectalcancer2011 | Not Found | https://www.canceraway.org.tw/colorectalcancer2011 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=315 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=211 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=212 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=213 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=214 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=202 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=203 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=204 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=205 |
| /918hair.canceraway.org.tw | Not Found | https://www.canceraway.org.tw/918hair.canceraway.org.tw |
| /%20%20https:/reurl.cc/3xGkWL | Not Found | https://www.canceraway.org.tw/%20%20https:/reurl.cc/3xGkWL |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=226 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=227 |
| /videolist.php |  | https://www.canceraway.org.tw/videolist.php?keyid=228 |
| /%20%E9%8A%80%E9%AB%AE%E5%81%8F%E9%84%89%20%E5%B0%B1%E9%86%AB%E7%84%A1%E7%A4%99 | Not Found | https://www.canceraway.org.tw/%20%E9%8A%80%E9%AB%AE%E5%81%8F%E9%84%89%20%E5%B0%B1%E9%86%AB%E7%84%A1%E7%A4%99 |
| /donateform.php | 本次捐款金額(NTD) | https://www.canceraway.org.tw/donateform.php?login=no |
| /beauti4_life/ | Not Found | https://www.canceraway.org.tw/beauti4_life/ |
| /love2009/ | Not Found | https://www.canceraway.org.tw/love2009/ |
| /%E7%99%8C%E5%8F%8B%E9%97%9C%E6%87%B7%E6%95%99%E8%82%B2%E4%B8%AD%E5%BF%83/%E5%8C%97%E9%83%A8%E8%BA%AB%E5%BF%83 | Not Found | https://www.canceraway.org.tw/%E7%99%8C%E5%8F%8B%E9%97%9C%E6%87%B7%E6%95%99%E8%82%B2%E4%B8%AD%E5%BF%83/%E5%8C%97%E9%83%A8%E8%BA%AB%E5%BF%83 |
| /ourchildrenmatter | Not Found | https://www.canceraway.org.tw/ourchildrenmatter |
| /fighter/ | Not Found | https://www.canceraway.org.tw/fighter/ |
| /2013pink/ | Not Found | https://www.canceraway.org.tw/2013pink/ |
| /HPV2012/ | Not Found | https://www.canceraway.org.tw/HPV2012/ |
| /colorectalcancer2012going | Not Found | https://www.canceraway.org.tw/colorectalcancer2012going |
| /colorectalcancer2011/ | Not Found | https://www.canceraway.org.tw/colorectalcancer2011/ |
| /donate.htm | Not Found | https://www.canceraway.org.tw/donate.htm |
| /colorectalcancer/ | Not Found | https://www.canceraway.org.tw/colorectalcancer/ |
| /pinkwalk/ | Not Found | https://www.canceraway.org.tw/pinkwalk/ |
| /icare/ | Not Found | https://www.canceraway.org.tw/icare/ |
| /fighter | Not Found | https://www.canceraway.org.tw/fighter |
| /colorectalcancer2010/ | Not Found | https://www.canceraway.org.tw/colorectalcancer2010/ |
| /carelove | Not Found | https://www.canceraway.org.tw/carelove |

## 五、文章頁（page.php，共 2466 篇）

文章編號（IDno）範圍：15 – 5301。多數舊文章頁面上沒有顯示發布日期，所以不做年份統計。

完整文章清單（標題、日期、網址）在 [`src/data/crawl-index.json`](src/data/crawl-index.json)。最新 30 篇：

| IDno | 日期 | 標題 |
|---:|---|---|
| 5301 | 2026-11-20 | [從受助者到陪伴者，延續生命的力量 - 黃淑芳](https://www.canceraway.org.tw/page.php?IDno=5301) |
| 5300 | 2026-11-20 | [把病痛寫成歌，將心魔唱成光 - 葉濬偉](https://www.canceraway.org.tw/page.php?IDno=5300) |
| 5299 | 2026-11-20 | [走過黑夜，成為別人的一盞燈 - 林其業](https://www.canceraway.org.tw/page.php?IDno=5299) |
| 5298 | 2026-11-20 | [揉捏希望，綻放生命之花 - 陳靜惠](https://www.canceraway.org.tw/page.php?IDno=5298) |
| 5297 | 2026-11-20 | [行在光明中，從病人到陪伴者 - 陳敬強](https://www.canceraway.org.tw/page.php?IDno=5297) |
| 5296 | 2026-11-20 | [人生格式化之後，跑出新的自己 - 陳彥儒](https://www.canceraway.org.tw/page.php?IDno=5296) |
| 5295 | 2026-11-20 | [越努力越幸運，向左手道別後重新擁抱生活 - 郭葦庭](https://www.canceraway.org.tw/page.php?IDno=5295) |
| 5294 | 2026-11-20 | [從病床到醫學系，把善意傳遞下去 - 張惠嵐](https://www.canceraway.org.tw/page.php?IDno=5294) |
| 5293 | 2026-11-20 | [帶著傷口，依然飛得很高 - 吳羿萱](https://www.canceraway.org.tw/page.php?IDno=5293) |
| 5292 | 2026-11-20 | [用歌聲唱回自己的人生 - 華中錡](https://www.canceraway.org.tw/page.php?IDno=5292) |
| 5291 | 2026-11-18 | [他肺癌兩度復發！靠這招穩定未復發 台癌免費心理諮商陪伴癌友 - 【TVBS健康2.0】](https://www.canceraway.org.tw/page.php?IDno=5291) |
| 5290 | 2026-11-18 | [癌症心理韌性降逾2成死亡風險 台癌推5+5社會處方 - 【中央社】](https://www.canceraway.org.tw/page.php?IDno=5290) |
| 5289 | 2026-11-18 | [影／攜手推動癌症新藥基金 劉建國：減少癌友及家庭壓力 - 【聯合新聞網】](https://www.canceraway.org.tw/page.php?IDno=5289) |
| 5288 | 2026-11-18 | [劉建國攜手病團推癌症新藥基金 盼法制化確保財源穩定 - 【中央社】](https://www.canceraway.org.tw/page.php?IDno=5288) |
| 5287 | 2026-11-14 | [基金會選出年度十大抗癌鬥士 患者將辛苦歷程化創作養分 - 【公視新聞】](https://www.canceraway.org.tw/page.php?IDno=5287) |
| 5286 | 2026-11-14 | [肚留23公分疤痕 女團鹿熙抗癌十年破繭成蝶獲選抗癌鬥士 - 【中央社】](https://www.canceraway.org.tw/page.php?IDno=5286) |
| 5285 | 2026-12-09 | [【高雄身心靈】講座：當癌症走進關係裡：伴侶如何不走散(11/19開始報名)](https://www.canceraway.org.tw/page.php?IDno=5285) |
| 5284 | 2026-12-04 | [【高雄身心靈】午茶話療講座 - 氣韻漫舞(11/18開始報名)](https://www.canceraway.org.tw/page.php?IDno=5284) |
| 5283 | 2026-11-07 | [乳癌公費篩檢率低 癌團揪500組癌友騎自行車 鼓勵民眾及早篩檢 - 【聯合新聞網】](https://www.canceraway.org.tw/page.php?IDno=5283) |
| 5282 | 2026-11-07 | [許維恩罹乳癌挺癌友 籲女性照顧自己、定期篩檢 - 【中央社】](https://www.canceraway.org.tw/page.php?IDno=5282) |
| 5281 | 2026-11-05 | [癌藥基金上路一年 癌團調查曝病人自費用藥月花逾5萬、13.2%借款償還 - 【經濟日報】](https://www.canceraway.org.tw/page.php?IDno=5281) |
| 5280 | 2026-11-05 | [癌症新藥等健保時間縮短58％！近8成自費用藥癌友 每月藥費逾3萬元 - 【TVBS健康2.0】](https://www.canceraway.org.tw/page.php?IDno=5280) |
| 5279 | 2026-10-03 | [不讓癌症框住人生！百位乳癌病友登「愛波舞后」舞台綻放自信 - 【匯流新聞網】](https://www.canceraway.org.tw/page.php?IDno=5279) |
| 5278 | 2026-10-03 | [台灣癌症基金會邀百位乳癌病友共舞 40歲護理師罹癌後靠跳舞重拾自信 - 【聯合新聞網】](https://www.canceraway.org.tw/page.php?IDno=5278) |
| 5277 | 2026-09-18 | [頸部長10公分腫瘤 確診第3期淋巴癌 - 【自由時報・自由健康網】](https://www.canceraway.org.tw/page.php?IDno=5277) |
| 5276 | 2026-09-17 | [45歲女頸部腫瘤長到10公分！竟確診第3期淋巴癌自費逾百萬元救命 醫界籲健保接軌國際 - 【TVBS健康2.0】](https://www.canceraway.org.tw/page.php?IDno=5276) |
| 5274 |  | [【最新消息】2026 晚期肺癌NGS檢測補助計畫 (115/11/02開始)](https://www.canceraway.org.tw/page.php?IDno=5274) |
| 5273 |  | [【最新公告】晚期肺癌NGS檢測補助計畫(115/11/2 開始收件，額滿為止)](https://www.canceraway.org.tw/page.php?IDno=5273) |
| 5271 |  | [【最新公告】2026 十大抗癌鬥士獲獎名單公布！](https://www.canceraway.org.tw/page.php?IDno=5271) |
| 5270 |  | [吃素癌友如何吃夠蛋白質？](https://www.canceraway.org.tw/page.php?IDno=5270) |

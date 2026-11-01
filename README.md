# Reels · 語言與文化小教室／公民與社會小教室

第一季五支、第二季十支直式（9:16，1080×1920，30 fps）教學動態圖文短片，對象是高中生，畫面走青春校園筆記本風格。
每支片約 52–64 秒，含旁白語音、燒錄字幕、AI 合成配樂與音效。

### 第一季：語言與文化小教室（EP.01–05）

| 成片 | 專案資料夾 | 片長 |
|---|---|---|
| `videos/格林定律.mp4` | `grimm-law/` | 63.8 s |
| `videos/薩丕爾－沃爾夫假說.mp4` | `sapir-whorf/` | 63.4 s |
| `videos/語意漂移.mp4` | `semantic-shift/` | 63.0 s |
| `videos/網路迷因.mp4` | `internet-meme/` | 62.5 s |
| `videos/文化擴散.mp4` | `cultural-diffusion/` | 62.1 s |

### 第二季：公民與社會小教室（EP.01–10）

| 成片 | 專案資料夾 | 片長 |
|---|---|---|
| `videos/路徑依賴.mp4` | `path-dependence/` | 63.3 s |
| `videos/基本收入制度.mp4` | `basic-income/` | 56.2 s |
| `videos/參與式預算.mp4` | `participatory-budgeting/` | 53.3 s |
| `videos/傑利蠑螈選區.mp4` | `gerrymandering/` | 57.1 s |
| `videos/比較利益原理.mp4` | `comparative-advantage/` | 60.7 s |
| `videos/網路中立性.mp4` | `net-neutrality/` | 57.7 s |
| `videos/數位公民權.mp4` | `digital-citizenship/` | 52.4 s |
| `videos/反公地悲劇.mp4` | `anticommons/` | 60.6 s |
| `videos/公民不服從.mp4` | `civil-disobedience/` | 56.7 s |
| `videos/代際契約.mp4` | `intergenerational-contract/` | 57.2 s |

完整的製作規格、分鏡思路與審片紀錄見 [`brief.md`](brief.md)。

## 怎麼做出來的

- **旁白稿**：`<專案>/script.json`。依使用者要求由 Claude 撰寫教學內容，每句再切成短子句。
- **語音**：`_engine/tts.py` 逐句用離線神經 TTS（sherpa-onnx + MeloTTS zh_en，MIT 授權，正常語速 1.0）合成，
  再把**實際量到的**子句起訖時間寫進 `audio/voice.json` 與 `timeline.js`。
  畫面、字幕高亮、角色嘴型和音效都讀同一份時間表。
- **畫面**：`_engine/engine.js`（共用的筆記本背景、標題、字幕卡、吉祥物、進度鉛筆、翻頁轉場）
  加上各專案的 `scenes.js`（每塊白板的教學動畫）。整支片純粹由時間 `t` 決定，所以每次輸出都一樣。
- **配樂與音效**：`_engine/score.music.mjs`（烏克麗麗感刷弦＋輕鼓，各主題的調性、速度和主奏樂器不同）
  與 `_engine/score.sfx.mjs`（翻頁、彈出、鈴聲），用 motion-showreel 的內建合成器產生。
- **混音**：`_engine/mix.py` 在每段旁白下自動壓低音樂，最後統一到 −14 LUFS、true peak −1.5 dBTP。

## 重建

```bash
pip install sherpa-onnx soundfile opencc-python-reimplemented numpy
```

```bash
mkdir -p .models && curl -L https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-melo-tts-zh_en.tar.bz2 | tar xj -C .models
```

```bash
SKILL=<motion-showreel skill 路徑> sh _engine/make.sh grimm-law
```

改稿時只要編輯 `script.json` 再重跑 `make.sh`：語音、時間軸、字幕和音效都會跟著更新。
如果只改了畫面，加上 `--skip-tts`。

## 素材與授權

- 字型：jf open 粉圓 2.1（SIL OFL 1.1）· `*/fonts/`
- 語音模型：MeloTTS zh_en（MIT），經 sherpa-onnx 轉換。模型檔不放進 repo（`.models/`）。
- 配樂、音效、插圖：全部由程式碼產生，沒有使用外部圖片或音樂。迷因卡片都是自創的塗鴉，不是真實迷因圖。

# AI Usage Discovery Extension

A lightweight proof-of-concept Chrome extension (Manifest V3) that keeps a list of the AI tools a user interacts with in the browser.

It finds AI tools by matching domains and by looking for signals inside the page. It records only non-sensitive metadata and shows a summary in the extension popup.

> **Status:** early scaffold. The popup, content script and background script are placeholders. The features below are planned and not built yet.

## What it will do

### 1. Detect AI tools

- **Domain matching:** compare each visited site against a curated list of known AI tools, such as `chatgpt.com`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com` and `perplexity.ai`.
- **In-page signals:** catch AI features that run on sites not in the list. Examples:
  - known widgets or SDK scripts embedded in the page
  - chat or prompt input elements
  - page meta tags or titles that mention AI products

### 2. Record only non-sensitive metadata

**Stored:**

- tool name and category (for example, chat assistant or code assistant)
- domain (hostname only, not the full URL)
- how it was detected (domain match or in-page signal)
- first seen and last seen timestamps
- visit or interaction count

**Never stored:**

- prompts, responses or any other page content
- form input, keystrokes or clipboard data
- cookies, auth tokens or credentials
- full URLs, query strings or path parameters

All data stays on the device in `chrome.storage.local`. Nothing is sent to a server.

### 3. Show a summary in the popup

- a list of detected AI tools with visit counts and last-used time
- total counts by tool and category
- a button to clear all recorded data

## Architecture

```
public/                 static assets (Straiker icons and logo)
src/
  popup/                popup UI that reads storage and shows the summary
  scripts/
    content.ts          runs in each page: domain check and in-page signal detection
    service-worker.ts   service worker: receives detections, deduplicates them and saves to storage
wxt.config.ts           build config and manifest (permissions etc.)
```

Data flow:

1. The content script detects an AI tool on the page.
2. It sends a message to the service worker.
3. The service worker updates the record in `chrome.storage.local`.
4. The popup reads that storage and renders the summary.

## Tech stack

- [WXT](https://wxt.dev) (Vite-based extension framework)
- React and TypeScript
- Chrome Manifest V3

## Getting started

```bash
npm install
npm run dev
npm run build
npm run zip
```

| Command | What it does | Output |
| --- | --- | --- |
| `npm run dev` | development build that reloads when files change | `dist/chrome-mv3-dev` |
| `npm run build` | production build | `dist/chrome-mv3` |
| `npm run zip` | zip of the production build for the Chrome Web Store | `dist/` |

To load the extension, open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked** and select `dist/chrome-mv3`.

## Conventions

- Use absolute imports. `@/` maps to `src/`, as in `import { x } from '@/utils/x'`.
- Don't put plain code files directly in `src/`, because WXT treats them as entrypoints. Put shared code in subfolders like `src/utils/` and `src/components/`.

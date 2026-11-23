# AI Usage Discovery Extension

A proof-of-concept Chrome extension (Manifest V3) that records which AI tools a user works with in the browser. It finds them in two ways: by matching the site's domain against a short list of known AI tools, and by spotting AI prompt boxes and AI buttons on other sites. It records only basic details: the site, when it was visited, whether AI was used and why the site was detected. It never reads what the user types, and nothing leaves the browser.

**Status:** POC complete.

## What it does

| Part | What it shows or does |
| --- | --- |
| **Popup** | Shows whether the current site uses AI, the tool or site name, a confidence percentage, the signals that matched, and when the tool was last used. |
| **Side panel** | Shows every detected tool with its visits and interactions, with live updates and a **Clear data** button. |
| **Detection** | Uses a domain match for the 4 tested AI tools, and signal scoring for any other site. |

## Detection

### 1. Domain matching (100% confidence)

If the site's hostname matches one of these domains, or is a subdomain of one, it counts as an AI tool with 100% confidence:

| Tool | Domains |
| --- | --- |
| ChatGPT | `chatgpt.com`, `chat.openai.com` |
| Claude | `claude.ai` |
| Gemini | `gemini.google.com` |
| Microsoft Copilot | `copilot.microsoft.com`, `copilot.com` |

These are the only tools that were tested. Others are commented out in `src/common/constants/aiTools.ts`.

**Every page load is one visit.** On these sites, each interaction is recorded with its time:
- **Prompt submitted:** Enter (without Shift) in the prompt box, a click on a button labelled "send", or a form submit that contains a prompt box.
- **AI button clicked:** a click on a button whose label contains "voice", such as ChatGPT's "Start Voice".

### 2. Signal matching (any other site)

**A text box** (a `textarea` or `contenteditable`) is scored **when the user focuses it**, out of 10:

| Signal | What it looks for | Points |
| --- | --- | --- |
| **AI word** | `ai`, `copilot`, `gemini`, `generativeai`, `claude` or `gpt` (as whole words) in the box's attributes or its visible placeholder | 3 |
| **Prompt wording** | the placeholder, aria-label or visible placeholder text starts with "ask" or "describe" | 2 |
| **Model picker** | nearby controls mention "model", or a model name (`claude`, `gpt`, `gemini`, `sonnet`, `opus`) | 2 |
| **AI nearby** | nearby controls mention `ai`, `agent`, `gemini` or `generativeai` | 1 |
| **Send control** | a nearby button whose label, title or `data-testid` contains "send" or "submit", or the box has `enterkeyhint="send"` | 2 |

- **Confidence:** the score × 10, as a percentage.
- **Threshold:** a score of **5 or more** counts as an AI prompt box.
- **"Nearby"** means within 5 parent levels of the box. The box's own content is never read.

**An AI button**, such as Google's "AI Mode", counts when it's clicked if its label contains an AI word. It's recorded at **50%** confidence and marked as used.

**For signal-detected sites, only the following is recorded:** the site, the confidence, the signals that matched, and whether AI was used (a send in that box, or a click on an AI button). What the user actually did isn't recorded.

### Signal examples

These were checked against saved HTML from each site, loaded locally with the extension:

| Site | Element | Signals matched | Result |
| --- | --- | --- | --- |
| **github.com** | Copilot chat box: placeholder "**Ask** anything…", aria-label "…with **Copilot**", "**Model:** Auto" button, "**Send** now" button | AI word, prompt wording, model picker, AI nearby, send control | **100%** |
| **Gmail** | "Help me write" box: aria-label "**Describe** your message", `--ae-**generativeai**-…` style, `data-enable-**gemini**-…`, `enterkeyhint="**send**"` | all 5 | **100%** |
| **Notion** | placeholder "**Ask Notion AI**", "Choose **AI model**" button, "**Submit AI** message" button | all 5 | **100%** |
| **Emergent** (app builder) | overlay placeholder "**Describe** your idea…", "Open **agent** and **model** menu" button, `data-testid="main-task-**submit**"` | prompt wording, model picker, AI nearby, send control | **70%** |
| **google.com** | the **"AI Mode"** button (the search box itself scores only 1/10) | AI button click | **50%**, used |

**Not detected (correctly):** the normal Gmail compose body ("Message Body"), the Google search box, and a Slack-style "Message #channel" box with a Send button.

## What's stored

All data stays in `chrome.storage.local` under `aiVisits`, as one record per visit:

```ts
{
  visitId, toolId, name, category, hostname,
  method: 'domain' | 'signal',
  signals: SignalId[],          // signal sites only
  confidence: number,           // 100 for a domain match, score × 10 for signals
  detectedAt: number,
  interacted: boolean,
  interactionType: 'prompt-submit' | 'ai-button' | null,
  interactions: { type, at }[]  // domain tools only
}
```

**Never stored:** prompts, responses, typed text, page content, full URLs, cookies or credentials.

## Architecture

```
Content script ──PAGE_LOADED──▶ Service worker ── domain match ──▶ save visit
   (all sites)  ──INTERACTED───▶                ── add interaction
                ──AI_DETECTED──▶                ── save signal visit
                ──AI_USED──────▶                ── mark as used
Popup ──GET_SITE_STATUS──▶ Service worker ──GET_PAGE_INFO──▶ active tab's content script
Side panel ──GET_VISITS / CLEAR_VISITS──▶ Service worker ──VISITS_UPDATED──▶ Side panel (live)
```

- **The content script collects and reports.** It runs at `document_start` on all sites. Signal scoring also happens here, on focus or click.
- **The service worker is the only part that touches storage.** It matches domains and saves visits.
- **The popup and side panel talk to the service worker** through typed messages only.
- **All Chrome API calls are in `src/common/chrome/`.**

```
src/
  common/            shared: chrome/ (runtime, tabs, storage, sidePanel), components/, constants/, types/, utils/, styles/
  content-script/    trackInteractions.ts, trackSignals.ts, signals/ (words, scoreTextBox, findAiButton)
  service-worker/    detection/matchDomain.ts, handlers/, saveVisits.ts
  popup/             App, layout/, store/ (Zustand), views/
  sidepanel/         App, components/, hooks/useVisits.ts, utils/groupByTool.ts
  scripts/           content.ts, service-worker.ts (entrypoints)
```

**Permissions:** `storage` and `sidePanel`. The content script runs on `<all_urls>`. No `tabs`, `cookies`, `history` or `webRequest` permissions.

## Tech stack

- [WXT](https://wxt.dev), React and TypeScript, Chrome Manifest V3
- Tailwind CSS v4 and Zustand
- Node 24 (WXT 0.21 needs Node 22.12 or newer)

## Getting started

```bash
npm install
npm run dev
npm run build
```

| Command | What it does | Output |
| --- | --- | --- |
| `npm run dev` | development build that reloads when files change | `dist/chrome-mv3-dev` |
| `npm run build` | production build | `dist/chrome-mv3` |
| `npm run zip` | zip of the production build | `dist/` |

To load the extension, open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked** and select `dist/chrome-mv3`. Then refresh any tabs that were already open.

## Known limitations

- **Signal-detected sites are named by hostname,** for example `github.com`, with the category "Embedded AI".
- **One visit per page:** only the first AI box or button on a page creates the visit.
- **Detection needs an action:** signals are checked only when a box is focused or a button is clicked. An open model menu isn't read, only the picker button.
- **Typing alone doesn't count as AI use.** Voice is detected only through a click on a voice button.
- **Pages that block extensions show as unsupported:** this includes `chrome://` pages and the Web Store, and tabs that were open before the extension was installed (until they're refreshed).
- **Data is per device.** It's lost if the extension is removed, and only **Clear data** deletes it.

## Conventions

- Use absolute imports. `@/` maps to `src/`.
- Don't put plain code files directly in `src/`, because WXT treats them as entrypoints. Put shared code in subfolders.

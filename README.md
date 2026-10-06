# Cover Letter Handoff

A privacy-focused Chrome Extension (Manifest V3) that extracts job postings from supported job platforms (Indeed and JobStreet), pairs them with your resume, and hands off a tailored prompt to **Claude** or **ChatGPT**.

---

## Why I Built This

I built this extension because I got tired of constantly switching back and forth between job posting websites and AI tools just to craft tailored cover letters. 

Instead of paying for expensive AI job-search subscriptions or manually copying and pasting job descriptions, requirements, and resume details every single time, I wanted a simple, free, and helpful handoff tool:
- Grab the job listing with one click.
- Combine it seamlessly with my saved resume.
- Copy a polished prompt to the clipboard and launch the AI web app ready to paste (`Ctrl + V`).

---

## Features

- **One-Click Scraping:** Automatically detects and extracts job title, company name, and job description from Indeed and JobStreet postings.
- **Customizable AI Websites:** Ships with defaults (Claude, ChatGPT, Gemini) and lets you add any AI chat website (Perplexity, DeepSeek, Copilot, Mistral, or local LLMs) with custom names and URLs.
- **Privacy-First Clipboard Handoff:** Copies your structured prompt directly to your clipboard and opens a clean provider tab—never leaking sensitive resume details into URL query parameters or browser history.
- **Prompt Injection Hardening:** Encloses scraped web text inside isolated `<job_posting>` XML boundary tags with explicit LLM constraints to prevent adversarial prompts from altering instructions.
- **Local Storage Only:** Your resume, preferences, and custom AI list are stored strictly inside your browser's local extension storage (`chrome.storage.local`) and never sent to external servers.
- **Daily Usage Tracking:** Automatically tracks how many letters you have prepared each day per provider.

---

## Supported Platforms

### Job Boards
- **Indeed** (`*.indeed.com`)
- **JobStreet** (`*.jobstreet.com`)

### AI Providers
- **Built-in Defaults:** Claude (`claude.ai`), ChatGPT (`chatgpt.com`), Google Gemini (`gemini.google.com`)
- **Custom AI Websites:** Add any website via extension settings (e.g. Perplexity, DeepSeek, Copilot, HuggingChat, or local Ollama/Open WebUI)

---

## Installation

Since this is an unpacked extension, you can install it directly in Google Chrome, Brave, Microsoft Edge, or any Chromium-based browser:

1. Open your browser and navigate to the Extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
2. Enable **Developer mode** (toggle switch usually found in the top-right corner).
3. Click the **Load unpacked** button.
4. Select the project directory:
   ```text
   C:\Users\USER\Projects\cover-letter-generator-ext
   ```
5. The extension **Cover Letter Handoff** will now appear in your extensions list and toolbar. (Pin it for easy access!)

---

## How to Use

### 1. Initial Setup
1. Click the extension icon in your browser toolbar.
2. Click **⚙️ Settings & AI Websites** (or right-click the extension icon and select **Options**).
3. Paste your **plain text resume** into the text area.
4. Select your preferred default tone (`Friendly`, `Formal`, or `Concise`).
5. *(Optional)* Manage your **AI Websites & Providers**:
   - Built-in defaults include Claude, ChatGPT, and Gemini.
   - Enter a Name and URL (e.g. `Perplexity` with `https://www.perplexity.ai/`) and click **+ Add AI Website**.
   - Remove any providers you don't use.
6. Click **Save Settings**.

### 2. Generating a Cover Letter
1. Navigate to any active job listing on **Indeed** or **JobStreet**.
2. Click the **Cover Letter Handoff** extension icon.
3. Click your preferred AI button (e.g., **Send to Claude**, **Send to ChatGPT**, **Send to Gemini**, or your custom added AI).
4. The extension will:
   - Extract the listing title, company, and description.
   - Assemble the structured prompt with your saved resume.
   - Copy the complete prompt to your system clipboard.
   - Open a new browser tab with your selected AI website.
5. In the opened AI chat tab, simply press **`Ctrl + V`** (or **`Cmd + V`** on macOS) into the input box and press Enter!

---

## Security & Privacy Considerations

- **No Remote Tracking:** The extension contains zero tracking pixels, analytics, or external telemetry scripts.
- **Safe Permissions:** Only uses `activeTab`, `storage`, and `clipboardWrite`.
- **Zero URL Query Strings:** Avoids `?q=` GET parameter prefilling to prevent personal information from being logged in web proxy logs or synced across cloud accounts.

---

## Project Structure

```text
cover-letter-generator-ext/
├── manifest.json       # Extension manifest (Manifest V3)
├── content.js          # Content script for scraping Indeed and JobStreet
├── popup.html          # Toolbar popup UI
├── popup.js            # Main handoff, clipboard, and usage tracking logic
├── options.html        # Settings page (resume and tone configuration)
├── options.js          # Settings storage management
├── .gitignore          # Git ignore rules
└── README.md           # Documentation and usage guide
```

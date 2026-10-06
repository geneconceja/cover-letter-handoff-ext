# Cover Letter Handoff

A privacy-focused Chrome Extension (Manifest V3) that extracts job postings from supported job platforms (Indeed and JobStreet), pairs them with your resume, and hands off a tailored prompt to **Claude** or **ChatGPT**.

---

## Features

- **One-Click Scraping:** Automatically detects and extracts job title, company name, and job description from Indeed and JobStreet postings.
- **Privacy-First Clipboard Handoff:** Copies your structured prompt directly to your clipboard and opens a clean provider tab—never leaking sensitive resume details into URL query parameters or browser history.
- **Prompt Injection Hardening:** Encloses scraped web text inside isolated `<job_posting>` XML boundary tags with explicit LLM constraints to prevent adversarial prompts from altering instructions.
- **Local Storage Only:** Your resume and tone preferences are stored strictly inside your browser's local extension storage (`chrome.storage.local`) and never sent to external third-party servers.
- **Daily Usage Tracking:** Automatically tracks how many letters you have prepared each day per provider.

---

## Supported Platforms

### Job Boards
- **Indeed** (`*.indeed.com`)
- **JobStreet** (`*.jobstreet.com`)

### AI Providers
- **Claude** (`claude.ai`)
- **ChatGPT** (`chatgpt.com`)

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
2. Click **Open settings** (or right-click the extension icon and select **Options**).
3. Paste your **plain text resume** into the text area.
4. Select your preferred default tone (`Friendly`, `Formal`, or `Concise`).
5. Click **Save**.

### 2. Generating a Cover Letter
1. Navigate to any active job listing on **Indeed** or **JobStreet**.
2. Click the **Cover Letter Handoff** extension icon.
3. Choose your provider:
   - Click **Send to Claude**, or
   - Click **Send to ChatGPT**.
4. The extension will:
   - Extract the listing details.
   - Assemble the structured prompt with your saved resume.
   - Copy the complete prompt to your system clipboard.
   - Open a new browser tab with the chosen provider.
5. In the new Claude or ChatGPT tab, simply press **`Ctrl + V`** (or **`Cmd + V`** on macOS) into the chat box and hit Enter!

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

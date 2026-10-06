const $ = (id) => document.getElementById(id);

const DEFAULT_PROVIDERS = [
  { id: "claude", name: "Claude", url: "https://claude.ai/new" },
  { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/" },
  { id: "gemini", name: "Gemini", url: "https://gemini.google.com/app" }
];

let providers = [];

function renderProviders() {
  const list = $("provider-list");
  list.innerHTML = "";

  if (providers.length === 0) {
    list.innerHTML = `<div style="font-size:13px; color:#888; padding:8px 0;">No AI providers configured. Add one below or click "Reset Default AI List".</div>`;
    return;
  }

  providers.forEach((p, idx) => {
    const row = document.createElement("div");
    row.className = "provider-row";

    const info = document.createElement("div");
    info.className = "provider-info";

    const nameEl = document.createElement("span");
    nameEl.className = "provider-name";
    nameEl.textContent = p.name;

    const urlEl = document.createElement("span");
    urlEl.className = "provider-url";
    urlEl.textContent = p.url;

    info.appendChild(nameEl);
    info.appendChild(urlEl);

    const btnRemove = document.createElement("button");
    btnRemove.className = "btn-remove";
    btnRemove.textContent = "Remove";
    btnRemove.type = "button";
    btnRemove.onclick = async () => {
      providers.splice(idx, 1);
      await chrome.storage.local.set({ providers });
      renderProviders();
    };

    row.appendChild(info);
    row.appendChild(btnRemove);
    list.appendChild(row);
  });
}

function validateUrl(str) {
  try {
    const parsed = new URL(str);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Initial load
chrome.storage.local.get(["resume", "tone", "providers"]).then((store) => {
  $("resume").value = store.resume || "";
  $("tone").value = store.tone || "friendly";
  providers = store.providers && store.providers.length > 0 ? store.providers : DEFAULT_PROVIDERS;
  renderProviders();
});

// Add new provider
$("add-provider").onclick = async () => {
  const err = $("provider-err");
  err.textContent = "";

  const name = $("new-name").value.trim();
  let url = $("new-url").value.trim();

  if (!name) {
    err.textContent = "Please enter a name for the AI website.";
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  if (!validateUrl(url)) {
    err.textContent = "Please enter a valid website URL (e.g. https://www.perplexity.ai/).";
    return;
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now().toString(36);
  providers.push({ id, name, url });

  await chrome.storage.local.set({ providers });
  $("new-name").value = "";
  $("new-url").value = "";
  renderProviders();
};

// Reset to defaults
$("reset-providers").onclick = async () => {
  providers = [...DEFAULT_PROVIDERS];
  await chrome.storage.local.set({ providers });
  renderProviders();
  $("provider-err").textContent = "";
};

// Save general settings
$("save").onclick = async () => {
  await chrome.storage.local.set({
    resume: $("resume").value,
    tone: $("tone").value,
    providers
  });
  $("msg").textContent = "Saved ✓";
  setTimeout(() => ($("msg").textContent = ""), 1500);
};
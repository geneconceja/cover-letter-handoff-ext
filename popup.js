const PROVIDERS = {
  claude:  { name: "Claude",  url: "https://claude.ai/new?q=" },
  chatgpt: { name: "ChatGPT", url: "https://chatgpt.com/?q=" }
};
const $ = (id) => document.getElementById(id);
const status = (t) => ($("status").textContent = t);

function buildPrompt(job, resume, tone) {
  return `Write a ${tone} cover letter under 300 words for this job.
Use ONLY facts from my resume. Do not invent experience.

JOB: ${job.title} at ${job.company}
${job.description.slice(0, 4000)}

MY RESUME:
${resume}`;
}

// ---- usage tracking (manual, since free-plan usage can't be read) ----
async function bumpCounter(key) {
  const today = new Date().toDateString();
  const k = `count_${key}`;
  const data = (await chrome.storage.local.get(k))[k];
  const next = data?.day === today ? { day: today, n: data.n + 1 } : { day: today, n: 1 };
  await chrome.storage.local.set({ [k]: next });
}

async function markLimited(key) {
  await chrome.storage.local.set({ [`limited_${key}`]: Date.now() });
  refresh();
}

async function refresh() {
  const { hours = 5 } = await chrome.storage.local.get("hours");
  for (const key of Object.keys(PROVIDERS)) {
    const store = await chrome.storage.local.get([`count_${key}`, `limited_${key}`]);
    const count = store[`count_${key}`];
    const today = count?.day === new Date().toDateString() ? count.n : 0;

    const since = store[`limited_${key}`];
    const msLeft = since ? since + hours * 3600_000 - Date.now() : 0;
    const blocked = msLeft > 0;

    $(key).disabled = blocked;
    $(`info-${key}`).textContent = blocked
      ? `Limit hit. Back in ~${Math.ceil(msLeft / 60000)} min`
      : `${today} letter(s) today`;
  }
}

// ---- main handoff ----
async function handoff(key) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const job = await chrome.tabs.sendMessage(tab.id, { type: "GET_JOB" });
    const { resume = "", tone = "friendly" } = await chrome.storage.local.get(["resume", "tone"]);

    if (!resume) return status("Add your resume in settings first.");
    if (!job?.description) return status("Couldn't read the job. Is a listing open?");

    const prompt = buildPrompt(job, resume, tone);
    await navigator.clipboard.writeText(prompt); // always-works fallback

    const url = PROVIDERS[key].url + encodeURIComponent(prompt);
    const prefilled = url.length < 6000;
    chrome.tabs.create({ url: prefilled ? url : PROVIDERS[key].url.split("?")[0] });

    await bumpCounter(key);
    refresh();
    status(prefilled ? "Opened with prompt prefilled (also copied)." : "Prompt copied. Paste it in the new tab.");
  } catch (e) {
    // Usually: content script not loaded (refresh the job page) or not on a supported site
    status("Error: " + e.message + ". Try refreshing the job page.");
  }
}

$("claude").onclick = () => handoff("claude");
$("chatgpt").onclick = () => handoff("chatgpt");
$("limit-claude").onclick = () => markLimited("claude");
$("limit-chatgpt").onclick = () => markLimited("chatgpt");
$("settings").onclick = () => chrome.runtime.openOptionsPage();

refresh();
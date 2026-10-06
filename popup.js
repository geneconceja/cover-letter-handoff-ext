const PROVIDERS = {
  claude:  { name: "Claude",  url: "https://claude.ai/new" },
  chatgpt: { name: "ChatGPT", url: "https://chatgpt.com/" }
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

// ---- usage tracking ----
async function bumpCounter(key) {
  const today = new Date().toDateString();
  const k = `count_${key}`;
  const data = (await chrome.storage.local.get(k))[k];
  const next = data?.day === today ? { day: today, n: data.n + 1 } : { day: today, n: 1 };
  await chrome.storage.local.set({ [k]: next });
}

async function refresh() {
  for (const key of Object.keys(PROVIDERS)) {
    const store = await chrome.storage.local.get(`count_${key}`);
    const count = store[`count_${key}`];
    const today = count?.day === new Date().toDateString() ? count.n : 0;
    $(`info-${key}`).textContent = `${today} letter(s) today`;
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
    await navigator.clipboard.writeText(prompt);
    chrome.tabs.create({ url: PROVIDERS[key].url });

    await bumpCounter(key);
    refresh();
    status("Prompt copied! Paste it in the new tab (Ctrl+V / Cmd+V).");
  } catch (e) {
    // Usually: content script not loaded (refresh the job page) or not on a supported site
    status("Error: " + e.message + ". Try refreshing the job page.");
  }
}

$("claude").onclick = () => handoff("claude");
$("chatgpt").onclick = () => handoff("chatgpt");
$("settings").onclick = () => chrome.runtime.openOptionsPage();

refresh();
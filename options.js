const $ = (id) => document.getElementById(id);

chrome.storage.local.get(["resume", "tone"]).then(({ resume = "", tone = "friendly" }) => {
  $("resume").value = resume;
  $("tone").value = tone;
});

$("save").onclick = async () => {
  await chrome.storage.local.set({
    resume: $("resume").value,
    tone: $("tone").value
  });
  $("msg").textContent = "Saved ✓";
  setTimeout(() => ($("msg").textContent = ""), 1500);
};
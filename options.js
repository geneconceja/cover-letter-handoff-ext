const $ = (id) => document.getElementById(id);

chrome.storage.local.get(["resume", "tone", "hours"]).then(({ resume = "", tone = "friendly", hours = 5 }) => {
  $("resume").value = resume;
  $("tone").value = tone;
  $("hours").value = hours;
});

$("save").onclick = async () => {
  await chrome.storage.local.set({
    resume: $("resume").value,
    tone: $("tone").value,
    hours: Number($("hours").value) || 5
  });
  $("msg").textContent = "Saved ✓";
  setTimeout(() => ($("msg").textContent = ""), 1500);
};
const pick = (sels) =>
  sels.map(s => document.querySelector(s)?.innerText?.trim()).find(Boolean) || "";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== "GET_JOB") return;

  const job = {
    title: pick(['[data-automation="job-detail-title"]', '[data-testid="jobsearch-JobInfoHeader-title"]', 'h1']),
    company: pick(['[data-automation="advertiser-name"]', '[data-testid="inlineHeader-companyName"]']),
    description: pick(['[data-automation="jobAdDetails"]', '#jobDescriptionText'])
  };

  // Fallback: if the description selector failed, send the page text instead
  if (!job.description) job.description = document.body.innerText.slice(0, 6000);

  console.log("[CoverLetterExt] scraped:", job);
  sendResponse(job);
});
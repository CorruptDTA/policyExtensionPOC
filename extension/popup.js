document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scanBtn');
  const status = document.getElementById('status');

  scanBtn.addEventListener('click', async () => {
    status.textContent = "Scanning...";

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Define categories and their respective highlight colors
    const categoryConfig = [
      {
        name: "Location",
        color: "#fecaca", // Light red
        borderColor: "#ef4444",
        terms: ["location", "gps", "precise location", "geolocation", "latitude"]
      },
      {
        name: "Identifiers & Analytics",
        color: "#fed7aa", // Light orange
        borderColor: "#f97316",
        terms: ["cookies", "identifiers", "device id", "advertising id", "browsing history", "third-party"]
      },
      {
        name: "Health & Diagnostics",
        color: "#bfdbfe", // Light blue
        borderColor: "#3b82f6",
        terms: ["health", "biometric", "sensor", "crash logs", "diagnostics"]
      }
    ];

    // Execute the scanner on the page and receive results back
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: runHighlightScanner,
      args: [categoryConfig]
    }, (results) => {
      if (results && results[0]?.result) {
        const count = results[0].result.matchCount;
        status.textContent = `Done! Highlighted ${count} clauses.`;
      }
    });
  });
});

// Runs inside the webpage context
function runHighlightScanner(categories) {
  let matchCount = 0;

  // Search through common text-bearing tags
  const targets = document.querySelectorAll('p, li, span, td');

  categories.forEach(category => {
    category.terms.forEach(term => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');

      targets.forEach(node => {
        // Only inspect text within nodes that have no sub-elements to prevent breaking page markup
        if (node.children.length === 0 && regex.test(node.textContent)) {
          node.innerHTML = node.innerHTML.replace(regex, (match) => {
            matchCount++;
            return `<mark style="background-color: ${category.color}; border-bottom: 2px solid ${category.borderColor}; padding: 1px 3px; border-radius: 2px; color: inherit;">${match}</mark>`;
          });
        }
      });
    });
  });

  return { matchCount };
}
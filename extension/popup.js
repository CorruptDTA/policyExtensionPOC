document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scanBtn');
  const status = document.getElementById('status');

  scanBtn.addEventListener('click', async () => {
    status.textContent = "Fetching config from database...";
      
    try {
      // Call your local Node.js API
      const response = await fetch('http://localhost:3000/api/config');
      const categoryConfig = await response.json();
    
      status.textContent = "Scanning...";
    
      // Proceed with the same injection logic as before
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: runHighlightScanner,
        args: [categoryConfig]
      }, (results) => {
         // ... handle results ...
      });
    
    } catch (error) {
      status.textContent = "Error connecting to local database API.";
    }

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
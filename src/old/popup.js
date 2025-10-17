document.getElementById("detectBtn").addEventListener("click", async () => {
  console.log("[Popup] Detect button clicked.");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error("[Popup] No active tab found.");

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async () => {
        // Give dynamic quiz pages a moment to load
        await new Promise((r) => setTimeout(r, 1000));

        const questionBlocks = [];

        // Pattern to recognize real questions
        const questionPattern = /^(\d+\.\s*)?.{3,150}\?$/;

        // Find all div-like containers that might hold questions
        const possibleBlocks = document.querySelectorAll("div, section, article");

        possibleBlocks.forEach((container) => {
          const text = container.innerText?.trim();
          if (!text) return;

          // check if container starts with a question
          const firstLine = text.split("\n")[0].trim();

          if (questionPattern.test(firstLine)) {
            const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

            const question = firstLine.replace(/^(\d+\.\s*)/, "").trim();
            const choices = [];

            // collect short lines after the first one (potential answers)
            for (let i = 1; i < lines.length && i <= 10; i++) {
              const c = lines[i];
              if (c.length < 80 && !c.endsWith("?")) {
                choices.push(c);
              }
            }

            // must have 2–6 answer-like lines
            if (choices.length >= 2 && choices.length <= 6) {
              questionBlocks.push({ question, choices });
            }
          }
        });

        // deduplicate by question text
        const seen = new Set();
        const unique = questionBlocks.filter((q) => {
          const key = q.question.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        return unique;
      },
    });

    console.log("──────────────────────────────");
    if (!result || result.length === 0) {
      console.log("[Popup] No valid multiple-choice questions detected.");
      alert("No valid multiple-choice questions detected.");
      return;
    }

    console.log(`[Popup] Found ${result.length} question(s):`);
    result.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.question}`);
      item.choices.forEach((c) => console.log("   " + c));
    });
    console.log("──────────────────────────────");

    alert(`Found ${result.length} question(s). Check the console for details.`);
  } catch (err) {
    console.error("[Popup] Error:", err);
    alert("❌ Error: " + err.message);
  }
});

document.getElementById("detectBtn").addEventListener("click", async () => {
  console.log("[Popup] Detect button clicked.");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error("[Popup] No active tab found.");

    // --- Step 1: Detect questions ---
    const [{ result: questions }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async () => {
        await new Promise((r) => setTimeout(r, 1000));
        const questionBlocks = [];
        const questionPattern = /^(\d+\.\s*)?.{3,150}(\?|:|,)?$/;
        const questionKeywords =
          /\b(who|what|when|where|why|how|which|choose|select|complete|fill|pick|identify|guess|name|are|is|do|does|did|can|could|should|would|will|has|have|had|may|might|must)\b/i;
        const possibleBlocks = document.querySelectorAll("div, section, article");

        possibleBlocks.forEach((container) => {
          const text = container.innerText?.trim();
          if (!text) return;
          const firstLine = text.split("\n")[0].trim();
          if (questionPattern.test(firstLine) && questionKeywords.test(firstLine)) {
            const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
            const question = firstLine.replace(/^(\d+\.\s*)/, "").trim();
            const choices = [];
            for (let i = 1; i < lines.length && i <= 10; i++) {
              const c = lines[i];
              if (c.length < 80 && !c.endsWith("?")) choices.push(c);
            }
            if (choices.length >= 2 && choices.length <= 6)
              questionBlocks.push({ question, choices });
          }
        });

        // Remove duplicates
        const seen = new Set();
        return questionBlocks.filter((q) => {
          const key = q.question.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      },
    });

    if (!questions || questions.length === 0) {
      alert("No questions found.");
      return;
    }

    console.log(`[Popup] Found ${questions.length} question(s). Asking AI...`);

    // ✅ FIXED: khai báo mảng chứa kết quả
    const results = [];

    // --- Step 2: Gọi AI handler ---
    for (const q of questions) {
      const result = await window.askAI(q);
      results.push({ ...q, answer: result });
      console.log("--------------------------------");
      console.log(JSON.stringify(result, null, 2));
    }

    alert(`AI finished answering ${questions.length} question(s). Check console.`);

    // --- Step 3: Lưu kết quả ---
    if (chrome?.storage?.local) {
      await chrome.storage.local.set({ aiResults: results });
      console.log("[Popup] Stored results in chrome.storage");
    } else {
      console.warn("[Popup] chrome.storage.local not available — using localStorage fallback");
      localStorage.setItem("aiResults", JSON.stringify(results));
    }

    // --- Step 4: Mở tab kết quả ---
    chrome.tabs.create({ url: chrome.runtime.getURL("./src/output/result.html") });
  } catch (err) {
    console.error("[Popup] Error:", err);
    alert(" Error: " + err.message);
  }
});

document.getElementById("detectBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const text = document.body.innerText;

      // Tách và lọc bỏ các dòng rác phổ biến
      const lines = text
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(
          (l) =>
            l &&
            !/^(random|refresh|show|comments|popular|more|all)$/i.test(l) &&
            !/^question\s*#?\d*/i.test(l)
        );

      const results = [];
      const questionPattern = /(\?|which of the following|choose|select)/i;
      const choicePattern = /^(\d+[\.\)]|-|[A-D][\.\)])\s?.+/i;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (questionPattern.test(line)) {
          const question = line;
          const choices = [];

          for (let j = i + 1; j < Math.min(i + 7, lines.length); j++) {
            if (choicePattern.test(lines[j]) || lines[j].length < 60) {
              choices.push(lines[j]);
            } else break;
          }

          if (choices.length >= 2) {
            results.push({ question, choices });
          }
        }
      }

      if (results.length > 0) {
        alert(`Found ${results.length} question(s). Check the console for details.`);
        console.log("Detected Questions and Choices:");
        results.forEach((r, idx) => {
          console.log(`${idx + 1}. ${r.question}`);
          r.choices.forEach((c) => console.log("   " + c));
        });
      } else {
        alert("No valid question with multiple choices detected.");
      }
    },
  });
});

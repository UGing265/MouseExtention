document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("results");

  // 🧠 Lấy dữ liệu từ storage
  let aiResults = [];
  try {
    if (chrome?.storage?.local) {
      const data = await chrome.storage.local.get("aiResults");
      aiResults = data.aiResults || [];
      console.log("[Result] Loaded from chrome.storage.local:", aiResults.length);
    } else {
      console.warn("[Result] chrome.storage.local not available — using localStorage fallback");
      aiResults = JSON.parse(localStorage.getItem("aiResults") || "[]");
      console.log("[Result] Loaded from localStorage:", aiResults.length);
    }
  } catch (err) {
    console.error("[Result] Error loading results:", err);
  }

  // ❌ Không có dữ liệu
  if (!aiResults || aiResults.length === 0) {
    container.innerHTML = `<p>No AI results found. Try running detection again.</p>`;
    return;
  }

  // ✅ Render danh sách kết quả
  container.innerHTML = "";
  aiResults.forEach((item, i) => {
    const block = document.createElement("div");
    block.className = "question";
    block.innerHTML = `
      <h3>${i + 1}. ${item.question}</h3>
      <div class="choices">${item.choices.map(c => "• " + c).join("<br>")}</div>
      <div class="answer"><strong>AI Answer:</strong> ${item.answer}</div>
    `;
    container.appendChild(block);
  });

  console.log(`[Result] Rendered ${aiResults.length} items successfully.`);
});

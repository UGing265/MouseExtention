// ai-handler.js
window.askAI = async function (questionData) {
  const OPENAI_API_KEY = window.APP_CONFIG?.OPENAI_API_KEY || "";
  if (!OPENAI_API_KEY) {
    console.error("Missing API key in config.js");
    return "No API key configured.";
  }



  console.log(" [AI Handler] Processing question:");
  console.log(" " + questionData.question);
  questionData.choices.forEach((c) => console.log("   " + c));

  try {
    const prompt = `
You are a quiz-solving assistant.
Given a multiple-choice question and options, choose the single best correct answer.
Return ONLY the answer text, no explanations.

Question: ${questionData.question}
Choices:
${questionData.choices.map((c) => "- " + c).join("\n")}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a concise AI that answers multiple-choice questions directly.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || "No answer";

    console.log(" [AI Answer]: " + answer);

    return answer;
  } catch (err) {
    console.error(" [AI Handler] Error:", err);
    return "Error contacting AI.";
  }
};

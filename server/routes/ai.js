import express from "express";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/* POST /api/ai/analyze */
router.post("/analyze", async (req, res) => {
  try {
    const stats = req.body;

    // Build prompt for Groq
    const prompt = `
You are an expert fitness coach AI. Given these user stats:
${JSON.stringify(stats)}

Return a JSON object only (no extra text) with:
- recovery_score (0-100)
- plan: a 5-day adaptive workout plan including:
  - date
  - activity
  - distance (for runs/bike)
  - intensity
  - exercises or intervals if relevant
`;

    // Call Groq OpenAI-compatible API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Return only JSON." },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
        }),
      }
    );

    const result = await response.json();
    console.log(result)

    // Groq response structure: choices[0].message.content
    const outputText = result.choices?.[0]?.message?.content;

    if (!outputText) {
      return res.status(500).json({ error: "No AI output returned" });
    }

    let parsed;
    try {
      parsed = JSON.parse(outputText); // Parse JSON safely
    } catch (err) {
      console.error("Failed to parse AI JSON:", err, "OutputText:", outputText);
      return res.status(500).json({ error: "Invalid AI JSON" });
    }

    res.json(parsed); // Send JSON to frontend
  } catch (err) {
    console.error("AI route error:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;
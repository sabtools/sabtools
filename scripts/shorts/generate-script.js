/**
 * Step 1: Generate YouTube Short script using Gemini AI
 */

const config = require("./config");

async function generateScript(tool) {
  // Try Gemini API with retries, fall back to template if unavailable
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const script = await callGemini(tool);
      if (script.hook && script.title) return script;
      console.log(`   Attempt ${attempt}: Empty response, retrying...`);
    } catch (err) {
      console.log(`   Attempt ${attempt} failed: ${err.message}`);
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, 6000)); // Wait for rate limit
  }

  // Fallback: Generate script from templates
  console.log("   Using template fallback (Gemini unavailable)");
  return generateFallbackScript(tool);
}

function generateFallbackScript(tool) {
  const hooks = {
    finance: `Yeh ${tool.name} aapke hazaaron rupaye bacha sakta hai!`,
    math: `${tool.name} se koi bhi calculation 2 second mein!`,
    text: `Content creators ke liye best tool — ${tool.name}!`,
    health: `Apni health track karo FREE mein — ${tool.name}!`,
    tax: `Tax bachana hai? Yeh ${tool.name} use karo!`,
    developer: `Developers, yeh tool aapka time bachayega!`,
    image: `Image editing FREE mein? Haan, ${tool.name} se!`,
    default: `Yeh FREE tool har Indian ko pata hona chahiye!`,
  };

  const hook = hooks[tool.category] || hooks.default;

  return {
    hook,
    scene1: `Open ${tool.name} on sabtools.in and enter your values`,
    narration1: `${tool.name} ek free online tool hai jo sabtools.in pe available hai. ${tool.description}. Isko use karna bahut easy hai, koi signup nahi chahiye.`,
    scene2: `Show the instant results on screen`,
    narration2: `Dekho kitna fast result aaya! Yeh tool 100% free hai aur aapka data safe rehta hai — sab kuch browser mein hota hai.`,
    cta: `Abhi try karo sabtools.in pe! Link in bio. 460+ free tools available hain!`,
    title: `${tool.name} FREE — Try Now! ${tool.icon} #shorts`,
    description: `Use ${tool.name} for free at sabtools.in\n460+ Free Online Tools for India\n#FreeTools #India #SabTools`,
    tags: [tool.name.toLowerCase(), "free tools", "india", "sabtools", "calculator", "online tool", tool.category, "free"],
    demoValues: {},
    fullText: "",
  };
}

async function callGemini(tool) {
  const prompt = `You are a viral Indian YouTube Shorts scriptwriter. Write a 30-second YouTube Short script for this free online tool.

Tool: ${tool.name}
Description: ${tool.description}
Category: ${tool.category}
Website: sabtools.in

FORMAT (follow exactly):
HOOK: [1 punchy line to grab attention in first 2 seconds — use Hindi-English mix like Indians actually speak. Examples: "Yeh calculator aapke lakhs bacha sakta hai!", "Stop wasting money on apps!"]

SCENE_1: [What to show on screen — describe the tool being used with SPECIFIC demo values]
NARRATION_1: [What to say — 2-3 sentences explaining the tool, mix Hindi-English naturally]

SCENE_2: [Show the result/output with specific numbers]
NARRATION_2: [React to the result, explain why it's useful — 2 sentences]

CTA: [Call to action — mention sabtools.in, "Link in bio", and "460+ free tools"]

TITLE: [YouTube Short title — catchy, under 60 chars, include emoji]
DESCRIPTION: [2-3 lines with hashtags — #FreeTools #India #SabTools]
TAGS: [comma-separated relevant tags, 8-10 tags]

DEMO_VALUES: [JSON object with input field names and values to type into the tool for the demo. Example for EMI calculator: {"loanAmount": "2500000", "interestRate": "8.5", "tenure": "20"}]

RULES:
- Keep it NATURAL — speak like a real Indian YouTuber, not a robot
- Use Hindi-English mix (Hinglish) for narration
- Include specific numbers in the demo (not generic)
- Make the hook surprising or relatable to Indian audience
- Total speaking time should be ~30 seconds
- DEMO_VALUES must be valid JSON`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 1000 },
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Parse the script
  const script = {
    hook: extractField(text, "HOOK"),
    scene1: extractField(text, "SCENE_1"),
    narration1: extractField(text, "NARRATION_1"),
    scene2: extractField(text, "SCENE_2"),
    narration2: extractField(text, "NARRATION_2"),
    cta: extractField(text, "CTA"),
    title: extractField(text, "TITLE"),
    description: extractField(text, "DESCRIPTION"),
    tags: extractField(text, "TAGS").split(",").map((t) => t.trim()),
    demoValues: extractDemoValues(text),
    fullText: text,
  };

  return script;
}

function extractField(text, field) {
  const regex = new RegExp(`${field}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, "s");
  const match = text.match(regex);
  return match ? match[1].trim().replace(/^\[|\]$/g, "") : "";
}

function extractDemoValues(text) {
  const regex = /DEMO_VALUES:\s*\[?\s*(\{[\s\S]*?\})\s*\]?/;
  const match = text.match(regex);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch {
      return {};
    }
  }
  return {};
}

module.exports = { generateScript };

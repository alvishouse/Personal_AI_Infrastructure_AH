/**
 * vet-idea.ts — Score a content idea across 5 dimensions using Claude.
 *
 * ICP context: Mid-Market Squeezed Directors/VPs of Operations (50-500 employees).
 * Returns structured scores + tier classification for the Notion Idea Bank.
 */

import Anthropic from "@anthropic-ai/sdk";

export interface IdeaInput {
  rawText: string;             // The original idea text from Telegram
  transcriptSummary?: string;  // Key concepts extracted from YouTube transcript
  addendum?: string;           // User's own callouts (when provided after YouTube URL)
}

export interface IdeaScores {
  name: string;                // Title for the translated ICP angle (max 8 words)
  icpAngle: string;            // What Alvis House would actually write about
  audienceRelevance: number;   // 1–5
  businessAlignment: number;   // 1–5
  timeliness: number;          // 1–5
  differentiation: number;     // 1–5
  extractionPotential: number; // 1–5
  totalScore: number;          // Sum of above (max 25)
  tier: "🔥 Hot" | "♨️ Warm" | "❄️ Cold"; // ≥20 Hot | ≥14 Warm | <14 Cold
  scoringNotes: string;        // 2-3 sentence rationale
  trackAlignment: string;      // Which Evergreen Track this connects to
}

const SCORING_PROMPT = `You are an ICP translation engine and content scoring system for Alvis House, an AI readiness and adoption consultant.

ICP: Mid-Market Squeezed — Directors/VPs of Operations and C-Level executives (50-500 employees) responsible for AI adoption outcomes. They feel behind, misled by hype, embarrassed by pilot failures. They are squeezed between board pressure to move fast and front-line resistance to change.

Offer: AI Readiness & Adoption Program — moves organizations from chaotic AI experimentation to structured, measurable AI adoption.

Voice: Declarative, no hedging, cross-disciplinary insight, 5th-grade reading level with MBA-level insight.

Evergreen Tracks:
- T1: Systems | T2: Culture | T3: Data Flow | T4: Strategy | T5: Pilot-to-Scale
- T6: Design Thinking | T7: BYOAI | T8: 6 Pillars of Readiness
- T9: Efficiency→Innovation | T10: Judgment over Automation

CRITICAL RULE — TRANSLATE BEFORE SCORING:
The raw input is a seed, not a brief. Never score the literal topic. Always ask: "What is the organizational implication of this for a Mid-Market leader trying to drive AI adoption?"

Examples of correct translation:
- "3 AI skills worth $500K" → "The talent gap killing your AI roadmap: roles orgs must build or hire to make adoption stick"
- "Microsoft Copilot vs Claude" → "Why 60% of Copilot deployments disappoint — and what the real problem is"
- "AI startup economics changed" → "The AI vendor you standardized on may not survive its own growth — how to vet for durability"
- "Speed of AI development" → "Your implementation timeline is wrong because you're benchmarking against last year's AI"

The translated angle is what you score and name. Capture it in "icpAngle" in your response.

Score the TRANSLATED angle on 5 dimensions (1-5 each):

1. Audience Relevance (1-5): Does the translated angle speak directly to board pressure, pilot embarrassment, implementation struggles, or front-line resistance?

2. Business Alignment (1-5): Does it naturally lead to or reinforce the AI Readiness & Adoption Program offer?

3. Timeliness (1-5): Is this relevant NOW? Will it still resonate in 3 months?

4. Differentiation (1-5): Is this a fresh take? Could only Alvis House write this convincingly?

5. Extraction Potential (1-5): Can this become 3+ LinkedIn posts + a newsletter + a cornerstone? Or is it one-and-done? High score = rich seam to mine over multiple pieces.

Scoring guide:
5 = Exceptional. Rarely give this.
4 = Strong. Clearly above average.
3 = Adequate. Meets the bar.
2 = Weak. Below par.
1 = Poor. Wrong audience or wrong fit.

Respond ONLY with valid JSON in this exact format (no markdown, no explanation outside the JSON):
{
  "name": "Short title for the TRANSLATED angle — max 8 words",
  "icpAngle": "1-2 sentence description of the translated angle — what Alvis House would actually write about, not the raw topic",
  "audienceRelevance": 4,
  "businessAlignment": 3,
  "timeliness": 5,
  "differentiation": 4,
  "extractionPotential": 3,
  "scoringNotes": "2-3 sentence rationale. Reference the translation — explain why the ICP angle scores the way it does.",
  "trackAlignment": "T3: Data Flow — brief reason. Or 'New Territory' if none apply."
}`;

const CONCEPT_EXTRACTION_PROMPT = `Extract 5-8 key content angles from this YouTube transcript. Prioritize:
- Counterintuitive ideas or reframes
- Statistics or data points (note if unverified)
- Frameworks or models described
- Problems or pains that resonate with business leaders
- Memorable quotes or phrases

For each point, write 1-2 sentences max. Format as a numbered list. Be specific — vague summaries have no value.

TRANSCRIPT:
`;

export async function vetIdea(
  anthropicApiKey: string,
  input: IdeaInput,
  model: string = "claude-sonnet-4-6"
): Promise<IdeaScores> {
  const client = new Anthropic({ apiKey: anthropicApiKey });

  const parts: string[] = [`IDEA:\n${input.rawText}`];
  if (input.transcriptSummary) {
    parts.push(`\nKEY CONCEPTS FROM VIDEO:\n${input.transcriptSummary}`);
  }
  if (input.addendum) {
    parts.push(`\nUSER'S OWN CALLOUTS:\n${input.addendum}`);
  }

  const response = await client.messages.create({
    model,
    max_tokens: 800,
    messages: [
      { role: "user", content: `${SCORING_PROMPT}\n\n---\n${parts.join("\n")}` },
    ],
  });

  const rawText = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Could not parse JSON from Claude response:\n${rawText.slice(0, 400)}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    name: string;
    icpAngle: string;
    audienceRelevance: number;
    businessAlignment: number;
    timeliness: number;
    differentiation: number;
    extractionPotential: number;
    scoringNotes: string;
    trackAlignment: string;
  };

  const totalScore =
    parsed.audienceRelevance +
    parsed.businessAlignment +
    parsed.timeliness +
    parsed.differentiation +
    parsed.extractionPotential;

  const tier =
    totalScore >= 20 ? "🔥 Hot" :
    totalScore >= 14 ? "♨️ Warm" :
                       "❄️ Cold";

  return { ...parsed, totalScore, tier };
}

export async function extractYouTubeConcepts(
  anthropicApiKey: string,
  transcript: string,
  model: string = "claude-haiku-4-5-20251001"
): Promise<string> {
  const client = new Anthropic({ apiKey: anthropicApiKey });

  // Haiku context: truncate transcript to ~24k chars (~6k tokens) to stay within limits
  const truncated = transcript.length > 24_000
    ? transcript.slice(0, 24_000) + "\n... [transcript truncated]"
    : transcript;

  const response = await client.messages.create({
    model,
    max_tokens: 600,
    messages: [
      { role: "user", content: `${CONCEPT_EXTRACTION_PROMPT}${truncated}` },
    ],
  });

  return response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");
}

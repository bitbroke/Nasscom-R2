/**
 * Sugoi-Vision: Narrative mapping for agent pipeline logs.
 * Replaces dry technical logs with Sugoi's sarcastic commentary.
 */

export interface SugoiNarrative {
  agent: string;
  sarcastic: string;
  expression: "focused" | "smug" | "scared" | "happy" | "normal";
}

const ANALYSER_LINES = [
  "Sugoi is putting on her goggles to hunt for PII... Master Ayush, why is your data so messy?~",
  "Scanning for secrets... Oh look, another email address left in the open. Typical. (◕ᴗ◕✿)",
  "Sugoi.exe is loading BERT NER... Your data privacy? Sugoi will protect it. Reluctantly.",
  "PII detected! Don't worry, Sugoi already shredded it. You're welcome, Master~",
];

const COUNCIL_LINES = [
  "Sugoi is professionally googling your issue... Please wait while I judge your choices.",
  "Consulting the ancient knowledge base... 1,000 tickets of wisdom at my disposal! (⁠≧⁠▽⁠≦⁠)",
  "BM25 Hybrid Search engaged! Sugoi is cross-referencing your problem with humanity's greatest failures~",
  "Council is bidding... The librarian found something interesting. Maybe. Don't get excited.",
];

const TRIAGE_LINES_TEMPLATE = [
  "Sugoi's brain is {conf}% sure this is a {cat} bug. The other {rest}% wants a nap.",
  "ONNX inference complete! Category: {cat} ({conf}% confidence). Sugoi is {verdict}.",
  "Running neural triage... {cat} detected at {conf}%. {agree}",
  "Sugoi's crystal ball says: {cat}! Confidence: {conf}%. Don't ask about the margin of error.",
];

const SYNTHESIS_LINES = [
  "Generating resolution... Sugoi is writing you a love letter. I mean, a runbook.",
  "Synthesis complete! Sugoi compiled the perfect answer. Probably. Hopefully. Good luck!~",
  "Assembling the fix from ancient scrolls and Stack Overflow... Don't tell anyone.",
  "Resolution synthesized! Sugoi used PATCH UPDATE! It's super effective! ✧",
];

const ERROR_LINES = [
  "ZERO-TRUST ERROR! Sugoi.exe has emotionally crashed... (╥_╥)",
  "Something went wrong! Sugoi is hiding under the desk. Please try again later~",
  "Critical failure detected! Sugoi needs a moment... and probably a reboot.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getAnalyserNarrative(piiCount: number): SugoiNarrative {
  let line = pickRandom(ANALYSER_LINES);
  if (piiCount > 0) line += ` (${piiCount} secrets found and destroyed!)`;
  return { agent: "Analyser", sarcastic: line, expression: "focused" };
}

export function getCouncilNarrative(bid: string | null, docs: number): SugoiNarrative {
  let line = pickRandom(COUNCIL_LINES);
  if (bid) line += ` Bid: "${bid}" from ${docs} docs.`;
  return { agent: "Council", sarcastic: line, expression: "focused" };
}

export function getTriageNarrative(cat: string | null, conf: number, agreed: boolean): SugoiNarrative {
  const confPct = Math.round(conf * 100);
  const restPct = 100 - confPct;
  const verdict = confPct >= 70 ? "impressed" : "skeptical";
  const agree = agreed ? "Council agrees! ✓" : "Council disagrees... escalating with a sigh.";
  let line = pickRandom(TRIAGE_LINES_TEMPLATE)
    .replace("{conf}", String(confPct))
    .replace("{rest}", String(restPct))
    .replace("{cat}", cat || "Unknown")
    .replace("{verdict}", verdict)
    .replace("{agree}", agree);
  return { agent: "Triage", sarcastic: line, expression: confPct >= 70 ? "smug" : "focused" };
}

export function getSynthesisNarrative(resolved: boolean): SugoiNarrative {
  if (!resolved) return { agent: "Synthesis", sarcastic: pickRandom(ERROR_LINES), expression: "scared" };
  return { agent: "Synthesis", sarcastic: pickRandom(SYNTHESIS_LINES), expression: "happy" };
}

/** Generate full Sugoi-Vision narrative from agent meta */
export function generateSugoiVision(agents: {
  analyser: { piiEntities: number };
  council: { bid: string | null; bidConfidence: number; documentsFound: number };
  triage: { onnxCategory: string | null; onnxConfidence: number; councilAgreement: boolean };
  synthesis: { skillUsed: string | null };
}, resolved: boolean): SugoiNarrative[] {
  return [
    getAnalyserNarrative(agents.analyser.piiEntities),
    getCouncilNarrative(agents.council.bid, agents.council.documentsFound),
    getTriageNarrative(agents.triage.onnxCategory, agents.triage.onnxConfidence, agents.triage.councilAgreement),
    getSynthesisNarrative(resolved),
  ];
}

/** Loading narratives shown while pipeline is running */
export const LOADING_NARRATIVES = [
  { text: "Sugoi is booting up her neural cores... ⚡", delay: 0 },
  { text: "Putting on analysis goggles... (⌐■_■)", delay: 2000 },
  { text: "Consulting the ancient knowledge base...", delay: 4000 },
  { text: "Running ONNX inference on Sugoi's brain...", delay: 6000 },
];



// --- Rules ---
const grammarRules = [
  { pattern: /\bteh\b/gi, correction: "the", type: "spelling" },
  { pattern: /\brecieve\b/gi, correction: "receive", type: "spelling" },
  { pattern: /\boccured\b/gi, correction: "occurred", type: "spelling" },
  { pattern: /\bseperate\b/gi, correction: "separate", type: "spelling" },
  { pattern: /\bdefinately\b/gi, correction: "definitely", type: "spelling" },
  { pattern: /\baccomodate\b/gi, correction: "accommodate", type: "spelling" },

  { pattern: /\s{2,}/g, correction: " ", type: "spacing" },
  { pattern: /([.!?,:;])([A-Z])/g, correction: "$1 $2", type: "punctuation" },

  { pattern: /\byour welcome\b/gi, correction: "you're welcome", type: "grammar" },
  { pattern: /\bits okay\b/gi, correction: "it's okay", type: "grammar" },
  { pattern: /\bshould of\b/gi, correction: "should have", type: "grammar" },
  { pattern: /\bcould of\b/gi, correction: "could have", type: "grammar" },
  { pattern: /\bwould of\b/gi, correction: "would have", type: "grammar" },
];

// --- Check Grammar ---
export const checkBasicGrammar = (text) => {
  const errors = [];
  grammarRules.forEach(({ pattern, correction, type }) => {
    for (const match of text.matchAll(pattern)) {
      errors.push({
        error: match[0],
        correction: typeof correction === "string" ? correction : match[0].replace(pattern, correction),
        type,
        position: match.index,
      });
    }
  });
  return errors;
};

// --- Highlight Errors ---
export const highlightErrors = (html, errors) => {
  let result = html;
  [...errors]
    .sort((a, b) => b.position - a.position) // process from end
    .forEach(({ error, correction, type }) => {
      const span = `<span class="grammar-error" title="${type}: ${correction}" 
        style="border-bottom:2px wavy red;cursor:help;">${error}</span>`;
      result = result.replace(error, span);
    });
  return result;
};

// --- Grammar Stats ---
export const getGrammarStats = (errors) =>
  errors.reduce(
    (stats, { type }) => ({ ...stats, [type]: (stats[type] || 0) + 1, total: stats.total + 1 }),
    { total: 0, spelling: 0, grammar: 0, punctuation: 0, spacing: 0 }
  );

// --- Apply Correction ---
export const applyCorrection = (text, { error, correction }) =>
  text.replace(error, correction);

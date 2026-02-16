function cleanText(text) {
  return text
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')   // collapse empty lines
    .replace(/[ \t]{2,}/g, ' ')  // collapse spaces
    .trim();
}

function extractRelevantSections(text) {
  const keywords = [
    'skills',
    'experience',
    'projects',
    'education',
    'technologies'
  ];
  return text
    .split('\n')
    .filter(line =>
      keywords.some(k => line.toLowerCase().includes(k)) ||
      line.length > 40
    )
    .join('\n');
};

function dedupeLines(text) {
  const seen = new Set();
  return text
    .split('\n')
    .filter(line => {
      const key = line.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join('\n');
}

function extractJSONBlocks(text) {
  const matches = text.match(/\{[\s\S]*?\}/g);
  if (!matches) return [];
  return matches.map(block => {
    try {
      return JSON.parse(block);
    } catch {
      return null;
    }
  }).filter(Boolean);
}

module.exports = {
  cleanText,
  extractRelevantSections,
  dedupeLines,
  extractJSONBlocks
}
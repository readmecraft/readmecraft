/**
 * Quality Audits & Completeness Scoring
 * Evaluates markdown and module state for formatting issues, accessibility, and readability.
 * Framework-agnostic: pure calculation logic. Never injected into the README output.
 */

/**
 * Validates a URL format without network requests
 * @param {string} url
 * @returns {boolean}
 */
export function isValidUrlFormat(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '#' || trimmed.startsWith('#')) return true;
  if (trimmed.startsWith('mailto:')) {
    return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(trimmed);
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Inspects generated markdown for links with invalid syntax or empty targets
 * @param {string} markdown
 * @returns {Array<string>}
 */
export function checkMarkdownLinks(markdown) {
  const issues = [];
  const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    const text = match[1].trim();
    const href = match[2].trim();

    if (!href) {
      issues.push(`Empty link target for "[${text || 'link'}]"`);
    } else if (!isValidUrlFormat(href)) {
      issues.push(`Malformed or invalid URL format: "${href}"`);
    }
  }

  return issues;
}

/**
 * Inspects markdown for images lacking meaningful alt text
 * @param {string} markdown
 * @returns {Array<string>}
 */
export function checkMissingAltText(markdown) {
  const issues = [];
  // Match ![alt](src)
  const imgRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
  let match;

  while ((match = imgRegex.exec(markdown)) !== null) {
    const alt = match[1].trim();
    const src = match[2].trim();

    if (!alt) {
      issues.push(`Image without alt text found: ${src.substring(0, 45)}...`);
    }
  }

  return issues;
}

/**
 * Checks content length
 * @param {string} markdown
 * @returns {object}
 */
export function checkLength(markdown) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const chars = markdown.length;

  return {
    words,
    chars,
    isTooShort: words < 25,
    isTooLong: words > 700
  };
}

/**
 * Main quality evaluator
 * @param {Array<object>} modules
 * @param {string} generatedMarkdown
 * @returns {{ score: number, warnings: Array<{ level: 'warn'|'info'|'error', text: string }> }}
 */
export function auditProfile(modules, generatedMarkdown) {
  const warnings = [];
  let score = 100;

  const activeModules = (modules || []).filter(m => m.enabled);
  const activeCount = activeModules.length;

  // 1. Module count check
  if (activeCount === 0) {
    warnings.push({ level: 'error', text: 'All modules are disabled. Enable at least one module.' });
    return { score: 0, warnings };
  }

  if (activeCount > 8) {
    score -= 10;
    warnings.push({
      level: 'warn',
      text: `${activeCount} modules active. Consider keeping to 5–7 modules to prevent visual fatigue.`
    });
  }

  // 2. Link format checking
  const linkIssues = checkMarkdownLinks(generatedMarkdown);
  if (linkIssues.length > 0) {
    score -= Math.min(20, linkIssues.length * 5);
    linkIssues.forEach(issue => warnings.push({ level: 'warn', text: issue }));
  }

  // 3. Alt text check
  const altIssues = checkMissingAltText(generatedMarkdown);
  if (altIssues.length > 0) {
    score -= Math.min(15, altIssues.length * 5);
    altIssues.forEach(issue => warnings.push({ level: 'warn', text: issue }));
  }

  // 4. Length audit
  const len = checkLength(generatedMarkdown);
  if (len.isTooShort) {
    score -= 10;
    warnings.push({
      level: 'info',
      text: `Brief profile (${len.words} words). Adding a bio or project descriptions improves credibility.`
    });
  } else if (len.isTooLong) {
    score -= 10;
    warnings.push({
      level: 'info',
      text: `Long profile (${len.words} words). Readers often skim; consider trimming extra lists.`
    });
  }

  // 5. Header presence
  const hasHeader = activeModules.some(m => m.id === 'header');
  if (!hasHeader) {
    score -= 10;
    warnings.push({
      level: 'info',
      text: 'Header module is disabled. A prominent headline and name establishes identity immediately.'
    });
  }

  // Ensure score is bounded between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    warnings
  };
}


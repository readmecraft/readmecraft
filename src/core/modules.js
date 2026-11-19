/**
 * Module definitions, default schemas, and helper functions.
 * Framework-agnostic: pure data structures and logic.
 */

export const MODULE_DEFINITIONS = [
  {
    id: 'header',
    title: 'Header & Name',
    category: 'identity',
    description: 'Headline, tagline, pronouns, and profile banner alignment.',
    defaultEnabled: true,
    defaultData: {
      name: 'Alex Rivera',
      pronouns: 'they/them',
      tagline: 'Senior Full-Stack Engineer specializing in performant web systems and developer tooling.',
      alignment: 'left', // 'left' | 'center'
      bannerType: 'none', // 'none' | 'capsule' | 'custom_img'
      bannerText: '',
      statusBadge: 'Open to select advisory & OSS work'
    }
  },
  {
    id: 'bio',
    title: 'Short Bio',
    category: 'identity',
    description: 'Current role, organization, location, and concise background.',
    defaultEnabled: true,
    defaultData: {
      role: 'Staff Software Engineer',
      company: 'Platform Architecture',
      location: 'San Francisco, CA / Remote',
      bioText: 'Building resilient distributed web systems, developer experience workflows, and accessible web standards.'
    }
  },
  {
    id: 'about_extras',
    title: 'About Extras',
    category: 'identity',
    description: 'Current focus, learning goals, collaboration interests, and fun facts.',
    defaultEnabled: true,
    defaultData: {
      workingOn: 'Next-generation web applications and zero-overhead dev tools',
      workingOnUrl: '',
      learning: 'WebAssembly, Rust systems programming, and distributed storage',
      collaboratingOn: 'High-leverage open-source developer tooling',
      askMeAbout: 'TypeScript, browser internals, software architecture, and API design',
      funFact: 'I restore mechanical keyboards in my spare time.'
    }
  },
  {
    id: 'tech_stack',
    title: 'Tech Stack',
    category: 'skills',
    description: 'Core languages, frameworks, databases, and development tooling.',
    defaultEnabled: true,
    defaultData: {
      style: 'badges', // 'badges' | 'icons' | 'list'
      badgeTheme: 'flat', // 'flat' | 'flat-square' | 'for-the-badge'
      languages: ['TypeScript', 'JavaScript', 'Python', 'Go', 'HTML5', 'CSS3'],
      frameworks: ['React', 'Next.js', 'Node.js', 'FastAPI'],
      databases: ['PostgreSQL', 'Redis', 'SQLite'],
      tools: ['Git', 'Docker', 'GitHub Actions', 'Linux']
    }
  },
  {
    id: 'pinned_repos',
    title: 'Pinned Repositories',
    category: 'work',
    description: 'Key open-source projects and featured code repositories.',
    defaultEnabled: true,
    defaultData: {
      layout: 'cards', // 'cards' | 'list'
      repos: [
        {
          name: 'hyper-fetch',
          owner: '',
          description: 'Ultra-lightweight HTTP client with automatic retries and zero dependencies.',
          language: 'TypeScript',
          stars: 120,
          url: 'https://github.com'
        },
        {
          name: 'cli-toolkit',
          owner: '',
          description: 'Composable terminal utilities for high-throughput pipeline workflows.',
          language: 'Go',
          stars: 84,
          url: 'https://github.com'
        }
      ]
    }
  },
  {
    id: 'stats',
    title: 'GitHub Stats Cards',
    category: 'activity',
    description: 'GitHub summary stats, commit streak, and top language cards.',
    defaultEnabled: true,
    defaultData: {
      theme: 'github_dark', // 'github_dark' | 'radical' | 'tokyonight' | 'onedark' | 'minimal'
      showStatsCard: true,
      showStreakCard: true,
      showTopLanguages: true,
      hideBorder: true,
      includePrivateCommits: true
    }
  },
  {
    id: 'socials',
    title: 'Social & Web Links',
    category: 'contact',
    description: 'Connect with me across developer networks, social media, and portfolios.',
    defaultEnabled: true,
    defaultData: {
      style: 'icons', // 'icons' | 'badges' | 'simple_links'
      links: [
        { platform: 'Twitter', url: 'https://x.com/', label: 'Twitter / X' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/', label: 'LinkedIn' },
        { platform: 'LeetCode', url: 'https://leetcode.com/u/', label: 'LeetCode' },
        { platform: 'Website', url: 'https://example.com', label: 'Portfolio' }
      ]
    }
  },
  {
    id: 'contact',
    title: 'Contact Details',
    category: 'contact',
    description: 'Direct email, scheduling link, and communication preferences.',
    defaultEnabled: false,
    defaultData: {
      email: 'alex@example.com',
      calendarUrl: '',
      discord: '',
      note: 'Best reached via email for speaking engagements, advisory, or technical inquiries.'
    }
  },
  {
    id: 'quote',
    title: 'Favorite Quote',
    category: 'extras',
    description: 'An inspirational or defining engineering quote.',
    defaultEnabled: false,
    defaultData: {
      quote: 'Write clear, straightforward code that solves real problems.',
      author: 'Engineering Proverb'
    }
  },
  {
    id: 'custom_markdown',
    title: 'Custom Markdown',
    category: 'extras',
    description: 'Any additional custom markdown, tables, embeds, or badges.',
    defaultEnabled: false,
    defaultData: {
      title: 'Current Notes',
      content: '### Open Source Sponsorship\nIf you find my tools useful, consider supporting development on GitHub Sponsors.'
    }
  },
  {
    id: 'ascii',
    title: 'ASCII Art / Banner',
    category: 'art',
    description: 'Generate custom text banners or convert images into static ASCII art.',
    defaultEnabled: false,
    defaultData: {
      mode: 'banner', // 'banner' | 'image'
      text: 'HELLO WORLD',
      font: 'slant', // 'standard' | 'slant' | 'block' | 'compact'
      charWidth: 60,
      charset: 'standard', // 'standard' | 'dense' | 'minimal' | 'blocks'
      contrast: 1.0,
      invert: false,
      artContent: ''
    }
  },
  {
    id: 'ascii_video',
    title: 'ASCII Video (Beta)',
    category: 'art',
    description: 'Convert short GIF/video clips into an animated SVG vector banner.',
    defaultEnabled: false,
    defaultData: {
      altText: 'Animated ASCII profile banner',
      fps: 10,
      columns: 50,
      charset: 'standard',
      contrast: 1.0,
      svgOutput: '',
      sizeBytes: 0
    }
  }
];

/**
 * Creates default list of modules with fresh clones of default data
 * @returns {Array<object>}
 */
export function getDefaultModules() {
  return MODULE_DEFINITIONS.map(def => ({
    id: def.id,
    title: def.title,
    category: def.category,
    enabled: def.defaultEnabled,
    data: JSON.parse(JSON.stringify(def.defaultData))
  }));
}

/**
 * Returns professional preset configuration (focused 6 core modules)
 * @param {Array<object>} currentModules
 * @returns {Array<object>}
 */
export function getProfessionalPreset(currentModules) {
  const professionalModuleIds = ['header', 'bio', 'about_extras', 'tech_stack', 'pinned_repos', 'stats', 'socials'];

  return currentModules.map(mod => ({
    ...mod,
    enabled: professionalModuleIds.includes(mod.id)
  }));
}

/**
 * Unticks all modules
 * @param {Array<object>} currentModules
 * @returns {Array<object>}
 */
export function clearAllModules(currentModules) {
  return currentModules.map(mod => ({
    ...mod,
    enabled: false
  }));
}

/**
 * Find module by ID
 * @param {Array<object>} modules
 * @param {string} id
 * @returns {object|undefined}
 */
export function findModule(modules, id) {
  return modules.find(m => m.id === id);
}

/**
 * Update module data immutably
 * @param {Array<object>} modules
 * @param {string} id
 * @param {object} partialData
 * @returns {Array<object>}
 */
export function updateModuleData(modules, id, partialData) {
  return modules.map(mod => {
    if (mod.id !== id) return mod;
    return {
      ...mod,
      data: {
        ...mod.data,
        ...partialData
      }
    };
  });
}

/**
 * Toggle module enabled state
 * @param {Array<object>} modules
 * @param {string} id
 * @param {boolean} [explicitState]
 * @returns {Array<object>}
 */
export function toggleModuleEnabled(modules, id, explicitState) {
  return modules.map(mod => {
    if (mod.id !== id) return mod;
    return {
      ...mod,
      enabled: typeof explicitState === 'boolean' ? explicitState : !mod.enabled
    };
  });
}

/**
 * Reorder modules in array
 * @param {Array<object>} modules
 * @param {number} fromIndex
 * @param {number} toIndex
 * @returns {Array<object>}
 */
export function reorderModules(modules, fromIndex, toIndex) {
  if (fromIndex < 0 || fromIndex >= modules.length || toIndex < 0 || toIndex >= modules.length) {
    return modules;
  }
  const result = [...modules];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}


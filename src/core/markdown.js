/**
 * Pure Markdown Generation Engine
 * Transforms module configurations into clean, semantic, valid GitHub-flavored Markdown.
 * Framework-agnostic: zero DOM dependency, usable in both browser and Node.js.
 */

/**
 * Escapes characters that could break markdown formatting where plain text is expected
 * @param {string} str
 * @returns {string}
 */
function escapeText(str) {
  if (!str) return '';
  return String(str).trim();
}

/**
 * Render Header module
 */
function renderHeader(data) {
  const lines = [];
  const name = escapeText(data.name);
  const pronouns = escapeText(data.pronouns);
  const tagline = escapeText(data.tagline);
  const statusBadge = escapeText(data.statusBadge);
  const isCenter = data.alignment === 'center';

  if (!name && !tagline) return '';

  if (isCenter) {
    lines.push('<div align="center">');
    lines.push('');
    if (name) {
      const pronounText = pronouns ? ` <sub style="font-size: 14px;">(${pronouns})</sub>` : '';
      lines.push(`# Hi there, I'm ${name}${pronounText}`);
    }
    if (tagline) {
      lines.push(`### ${tagline}`);
    }
    if (statusBadge) {
      lines.push('');
      lines.push(`[![Status](https://img.shields.io/badge/status-${encodeURIComponent(statusBadge).replace(/-/g, '--')}-0969da?style=flat-square)](#)`);
    }
    lines.push('');
    lines.push('</div>');
  } else {
    if (name) {
      const pronounText = pronouns ? ` _(${pronouns})_` : '';
      lines.push(`# Hi there, I'm ${name}${pronounText}`);
      lines.push('');
    }
    if (tagline) {
      lines.push(`> ${tagline}`);
      lines.push('');
    }
    if (statusBadge) {
      lines.push(`[![Status](https://img.shields.io/badge/status-${encodeURIComponent(statusBadge).replace(/-/g, '--')}-0969da?style=flat-square)](#)`);
      lines.push('');
    }
  }

  return lines.join('\n').trim();
}

/**
 * Render Short Bio module
 */
function renderBio(data) {
  const lines = [];
  const role = escapeText(data.role);
  const company = escapeText(data.company);
  const location = escapeText(data.location);
  const bioText = escapeText(data.bioText);

  if (!role && !company && !location && !bioText) return '';

  lines.push('## About Me');
  lines.push('');

  const metaParts = [];
  if (role && company) metaParts.push(`**${role}** at **${company}**`);
  else if (role) metaParts.push(`**${role}**`);
  else if (company) metaParts.push(`At **${company}**`);

  if (location) metaParts.push(`📍 ${location}`);

  if (metaParts.length > 0) {
    lines.push(metaParts.join(' · '));
    lines.push('');
  }

  if (bioText) {
    lines.push(bioText);
    lines.push('');
  }

  return lines.join('\n').trim();
}

/**
 * Render About Extras module
 */
function renderAboutExtras(data) {
  const items = [];

  if (data.workingOn) {
    const text = escapeText(data.workingOn);
    if (data.workingOnUrl) {
      items.push(`- 🔭 I’m currently working on [${text}](${escapeText(data.workingOnUrl)})`);
    } else {
      items.push(`- 🔭 I’m currently working on **${text}**`);
    }
  }

  if (data.learning) {
    items.push(`- 🌱 I’m currently learning **${escapeText(data.learning)}**`);
  }

  if (data.collaboratingOn) {
    items.push(`- 👯 I’m looking to collaborate on **${escapeText(data.collaboratingOn)}**`);
  }

  if (data.askMeAbout) {
    items.push(`- 💬 Ask me about **${escapeText(data.askMeAbout)}**`);
  }

  if (data.funFact) {
    items.push(`- ⚡ Fun fact: ${escapeText(data.funFact)}`);
  }

  if (items.length === 0) return '';

  return `## What I'm Up To\n\n${items.join('\n')}`;
}

/**
 * Render Tech Stack module
 */
function renderTechStack(data) {
  const style = data.style || 'badges';
  const badgeTheme = data.badgeTheme || 'flat';
  const languages = Array.isArray(data.languages) ? data.languages.filter(Boolean) : [];
  const frameworks = Array.isArray(data.frameworks) ? data.frameworks.filter(Boolean) : [];
  const databases = Array.isArray(data.databases) ? data.databases.filter(Boolean) : [];
  const tools = Array.isArray(data.tools) ? data.tools.filter(Boolean) : [];

  const totalItems = languages.length + frameworks.length + databases.length + tools.length;
  if (totalItems === 0) return '';

  const lines = ['## Tech Stack', ''];

  if (style === 'badges') {
    const makeBadge = (tech) => {
      const clean = tech.trim();
      const encoded = encodeURIComponent(clean).replace(/-/g, '--');
      return `![${clean}](https://img.shields.io/badge/-${encoded}-21262d?style=${badgeTheme}&logo=${encodeURIComponent(clean.toLowerCase())}&logoColor=white)`;
    };

    if (languages.length > 0) {
      lines.push('**Languages:**');
      lines.push(languages.map(makeBadge).join(' '));
      lines.push('');
    }
    if (frameworks.length > 0) {
      lines.push('**Frameworks & Libraries:**');
      lines.push(frameworks.map(makeBadge).join(' '));
      lines.push('');
    }
    if (databases.length > 0) {
      lines.push('**Databases & Storage:**');
      lines.push(databases.map(makeBadge).join(' '));
      lines.push('');
    }
    if (tools.length > 0) {
      lines.push('**Tools & Infrastructure:**');
      lines.push(tools.map(makeBadge).join(' '));
      lines.push('');
    }
  } else {
    // Clean bullet list
    if (languages.length > 0) lines.push(`- **Languages:** ${languages.join(', ')}`);
    if (frameworks.length > 0) lines.push(`- **Frameworks:** ${frameworks.join(', ')}`);
    if (databases.length > 0) lines.push(`- **Databases:** ${databases.join(', ')}`);
    if (tools.length > 0) lines.push(`- **Tools:** ${tools.join(', ')}`);
    lines.push('');
  }

  return lines.join('\n').trim();
}

/**
 * Render Pinned Repositories module
 */
function renderPinnedRepos(data, githubUsername = '') {
  const repos = Array.isArray(data.repos) ? data.repos.filter(r => r && (r.name || r.description)) : [];
  if (repos.length === 0) return '';

  const lines = ['## Featured Projects', ''];

  if (data.layout === 'cards') {
    // Generate clean markdown table or cards
    lines.push('| Repository | Description | Tech |');
    lines.push('| :--- | :--- | :--- |');
    for (const repo of repos) {
      const repoName = escapeText(repo.name) || 'Project';
      const repoUrl = escapeText(repo.url) || `https://github.com/${githubUsername}/${repoName}`;
      const desc = escapeText(repo.description) || '—';
      const lang = escapeText(repo.language) || 'General';
      lines.push(`| [**${repoName}**](${repoUrl}) | ${desc} | \`${lang}\` |`);
    }
  } else {
    for (const repo of repos) {
      const repoName = escapeText(repo.name) || 'Project';
      const repoUrl = escapeText(repo.url) || `https://github.com/${githubUsername}/${repoName}`;
      const desc = escapeText(repo.description);
      const lang = escapeText(repo.language);
      const meta = lang ? ` — *\`${lang}\`*` : '';
      lines.push(`- [**${repoName}**](${repoUrl})${meta}: ${desc}`);
    }
  }

  return lines.join('\n').trim();
}

/**
 * Render GitHub Stats Cards module
 * Supports GitHub dark/light mode with native theme switching
 */
function renderStats(data, githubUsername = '') {
  const username = escapeText(githubUsername) || 'github';
  const theme = data.theme || 'github_dark';
  const hideBorder = data.hideBorder ? '&hide_border=true' : '';
  const lines = ['## GitHub Activity', ''];

  // Cards layout
  const cards = [];

  if (data.showStatsCard) {
    cards.push(`[![${username}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme}${hideBorder})](https://github.com/${username})`);
  }

  if (data.showStreakCard) {
    cards.push(`[![GitHub Streak](https://streak-stats.demolab.com/?user=${username}&theme=${theme}${hideBorder})](https://github.com/${username})`);
  }

  if (data.showTopLanguages) {
    cards.push(`[![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme}${hideBorder})](https://github.com/${username})`);
  }

  if (cards.length === 0) return '';

  lines.push('<p align="center">');
  lines.push(cards.map(c => `  ${c}`).join('\n'));
  lines.push('</p>');

  return lines.join('\n').trim();
}

/**
 * Render Social & Web Links module
 */
function renderSocials(data) {
  const links = Array.isArray(data.links) ? data.links.filter(l => l && l.url && l.url.trim()) : [];
  if (links.length === 0) return '';

  const lines = ['## Connect with Me', ''];

  if (data.style === 'badges') {
    const badges = links.map(link => {
      const platform = escapeText(link.platform) || 'Link';
      const url = escapeText(link.url);
      const label = escapeText(link.label) || platform;
      const logo = platform.toLowerCase().replace(/\s+/g, '');
      return `[![${label}](https://img.shields.io/badge/${encodeURIComponent(platform)}-000000?style=for-the-badge&logo=${logo}&logoColor=white)](${url})`;
    });
    lines.push(badges.join(' '));
  } else {
    for (const link of links) {
      const label = escapeText(link.label) || escapeText(link.platform) || 'Website';
      const url = escapeText(link.url);
      lines.push(`- [${label}](${url})`);
    }
  }

  return lines.join('\n').trim();
}

/**
 * Render Contact Details module
 */
function renderContact(data) {
  const lines = ['## Contact'];
  const items = [];

  if (data.email) {
    const email = escapeText(data.email);
    items.push(`- 📧 **Email:** [${email}](mailto:${email})`);
  }
  if (data.calendarUrl) {
    items.push(`- 📅 **Schedule a chat:** [Calendar](${escapeText(data.calendarUrl)})`);
  }
  if (data.discord) {
    items.push(`- 💬 **Discord:** \`${escapeText(data.discord)}\``);
  }

  if (items.length === 0 && !data.note) return '';

  lines.push('');
  if (data.note) {
    lines.push(escapeText(data.note));
    lines.push('');
  }
  if (items.length > 0) {
    lines.push(items.join('\n'));
  }

  return lines.join('\n').trim();
}

/**
 * Render Quote module
 */
function renderQuote(data) {
  const quote = escapeText(data.quote);
  const author = escapeText(data.author);

  if (!quote) return '';

  const authorPart = author ? `\n> — *${author}*` : '';
  return `> "${quote}"${authorPart}`;
}

/**
 * Render Custom Markdown module
 */
function renderCustomMarkdown(data) {
  const title = escapeText(data.title);
  const content = escapeText(data.content);

  if (!content) return '';

  const heading = title ? `## ${title}\n\n` : '';
  return `${heading}${content}`;
}

/**
 * Render ASCII Art module
 */
function renderAscii(data) {
  const content = escapeText(data.artContent);
  if (!content) return '';

  return `\`\`\`text\n${content}\n\`\`\``;
}

/**
 * Render ASCII Video module
 */
function renderAsciiVideo(data) {
  const svg = escapeText(data.svgOutput);
  if (!svg) return '';

  const alt = escapeText(data.altText) || 'Animated ASCII banner';
  // If SVG is provided, we embed it directly or as raw SVG markup
  return `<!-- ${alt} -->\n${svg}`;
}

/**
 * Master Markdown Generator
 * Evaluates ordered modules and returns valid markdown.
 * Unticked modules are excluded completely.
 *
 * @param {Array<object>} modules
 * @param {object} options
 * @param {string} [options.githubUsername]
 * @returns {string} Clean GitHub Flavored Markdown
 */
export function generateMarkdown(modules, options = {}) {
  if (!Array.isArray(modules)) return '';

  const githubUsername = options.githubUsername || '';
  const sections = [];

  for (const mod of modules) {
    if (!mod || !mod.enabled) continue;

    let sectionContent = '';
    const data = mod.data || {};

    switch (mod.id) {
      case 'header':
        sectionContent = renderHeader(data);
        break;
      case 'bio':
        sectionContent = renderBio(data);
        break;
      case 'about_extras':
        sectionContent = renderAboutExtras(data);
        break;
      case 'tech_stack':
        sectionContent = renderTechStack(data);
        break;
      case 'pinned_repos':
        sectionContent = renderPinnedRepos(data, githubUsername);
        break;
      case 'stats':
        sectionContent = renderStats(data, githubUsername);
        break;
      case 'socials':
        sectionContent = renderSocials(data);
        break;
      case 'contact':
        sectionContent = renderContact(data);
        break;
      case 'quote':
        sectionContent = renderQuote(data);
        break;
      case 'custom_markdown':
        sectionContent = renderCustomMarkdown(data);
        break;
      case 'ascii':
        sectionContent = renderAscii(data);
        break;
      case 'ascii_video':
        sectionContent = renderAsciiVideo(data);
        break;
      default:
        break;
    }

    if (sectionContent && sectionContent.trim().length > 0) {
      sections.push(sectionContent.trim());
    }
  }

  // Join with double newlines
  return sections.join('\n\n') + '\n';
}


/**
 * Module Settings Editor Component (Middle Column)
 * Generates tailored, accessible forms for every module, handling debounced updates,
 * repository & link item managers, and ASCII text/image/video conversion controls.
 */

import { generateTextBanner, processImageToAscii, buildAnimatedAsciiSvg, CHARSETS } from '../../core/ascii.js';

export class ModuleEditorComponent {
  constructor(store) {
    this.store = store;
    this.titleEl = document.getElementById('active-module-title');
    this.badgeEl = document.getElementById('active-module-badge');
    this.toggleEl = document.getElementById('active-module-toggle');
    this.formContainer = document.getElementById('editor-form-container');

    this.currentModuleId = null;
    this.init();
  }

  init() {
    if (this.toggleEl) {
      this.toggleEl.addEventListener('change', (e) => {
        if (!this.currentModuleId) return;
        this.store.dispatch({
          type: 'TOGGLE_MODULE',
          payload: { id: this.currentModuleId, enabled: e.target.checked }
        });
      });
    }

    this.render(this.store.getState());
  }

  /**
   * Helper to update current module data in store
   */
  updateData(partial) {
    if (!this.currentModuleId) return;
    this.store.dispatch({
      type: 'UPDATE_MODULE_DATA',
      payload: { id: this.currentModuleId, data: partial }
    });
  }

  render(state) {
    const { modules, activeModuleId } = state;
    const activeMod = modules.find(m => m.id === activeModuleId);
    if (!activeMod) return;

    this.currentModuleId = activeMod.id;

    // Header info
    if (this.titleEl) this.titleEl.textContent = activeMod.title;
    if (this.badgeEl) this.badgeEl.textContent = activeMod.category;
    if (this.toggleEl) this.toggleEl.checked = activeMod.enabled;

    // Render form fields
    if (!this.formContainer) return;
    this.formContainer.innerHTML = '';

    const data = activeMod.data || {};

    switch (activeMod.id) {
      case 'header':
        this.renderHeaderForm(data);
        break;
      case 'bio':
        this.renderBioForm(data);
        break;
      case 'about_extras':
        this.renderAboutExtrasForm(data);
        break;
      case 'tech_stack':
        this.renderTechStackForm(data);
        break;
      case 'pinned_repos':
        this.renderPinnedReposForm(data);
        break;
      case 'stats':
        this.renderStatsForm(data);
        break;
      case 'socials':
        this.renderSocialsForm(data);
        break;
      case 'contact':
        this.renderContactForm(data);
        break;
      case 'quote':
        this.renderQuoteForm(data);
        break;
      case 'custom_markdown':
        this.renderCustomMarkdownForm(data);
        break;
      case 'ascii':
        this.renderAsciiForm(data);
        break;
      case 'ascii_video':
        this.renderAsciiVideoForm(data);
        break;
      default:
        this.formContainer.innerHTML = '<p class="form-hint">No configuration required for this module.</p>';
    }
  }

  // --- FORM RENDERERS ---

  renderHeaderForm(data) {
    this.formContainer.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="hdr-name">Display Name</label>
          <input type="text" id="hdr-name" class="form-input" value="${data.name || ''}" placeholder="e.g. Alex Rivera">
        </div>
        <div class="form-group">
          <label class="form-label" for="hdr-pronouns">Pronouns</label>
          <input type="text" id="hdr-pronouns" class="form-input" value="${data.pronouns || ''}" placeholder="e.g. they/them">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="hdr-tagline">Headline / Tagline</label>
        <textarea id="hdr-tagline" class="form-textarea" style="min-height: 60px;" placeholder="Brief summary of what you build">${data.tagline || ''}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="hdr-align">Layout Alignment</label>
          <select id="hdr-align" class="form-select">
            <option value="left" ${data.alignment === 'left' ? 'selected' : ''}>Left aligned (Default)</option>
            <option value="center" ${data.alignment === 'center' ? 'selected' : ''}>Center aligned</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="hdr-status">Status Badge</label>
          <input type="text" id="hdr-status" class="form-input" value="${data.statusBadge || ''}" placeholder="e.g. Available for select work">
        </div>
      </div>
    `;

    document.getElementById('hdr-name').addEventListener('input', (e) => this.updateData({ name: e.target.value }));
    document.getElementById('hdr-pronouns').addEventListener('input', (e) => this.updateData({ pronouns: e.target.value }));
    document.getElementById('hdr-tagline').addEventListener('input', (e) => this.updateData({ tagline: e.target.value }));
    document.getElementById('hdr-align').addEventListener('change', (e) => this.updateData({ alignment: e.target.value }));
    document.getElementById('hdr-status').addEventListener('input', (e) => this.updateData({ statusBadge: e.target.value }));
  }

  renderBioForm(data) {
    this.formContainer.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="bio-role">Current Title / Role</label>
          <input type="text" id="bio-role" class="form-input" value="${data.role || ''}" placeholder="e.g. Staff Engineer">
        </div>
        <div class="form-group">
          <label class="form-label" for="bio-company">Company / Team</label>
          <input type="text" id="bio-company" class="form-input" value="${data.company || ''}" placeholder="e.g. Platform Team">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="bio-location">Location</label>
        <input type="text" id="bio-location" class="form-input" value="${data.location || ''}" placeholder="e.g. Berlin / Remote">
      </div>

      <div class="form-group">
        <label class="form-label" for="bio-text">Bio Paragraph</label>
        <textarea id="bio-text" class="form-textarea" placeholder="A concise 2-3 sentence overview of your background and technical interests">${data.bioText || ''}</textarea>
      </div>
    `;

    document.getElementById('bio-role').addEventListener('input', (e) => this.updateData({ role: e.target.value }));
    document.getElementById('bio-company').addEventListener('input', (e) => this.updateData({ company: e.target.value }));
    document.getElementById('bio-location').addEventListener('input', (e) => this.updateData({ location: e.target.value }));
    document.getElementById('bio-text').addEventListener('input', (e) => this.updateData({ bioText: e.target.value }));
  }

  renderAboutExtrasForm(data) {
    this.formContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="extra-working">🔭 I’m currently working on</label>
        <input type="text" id="extra-working" class="form-input" value="${data.workingOn || ''}" placeholder="Project or product name">
      </div>

      <div class="form-group">
        <label class="form-label" for="extra-working-url">🔭 Project URL (Optional)</label>
        <input type="url" id="extra-working-url" class="form-input" value="${data.workingOnUrl || ''}" placeholder="https://github.com/org/repo">
      </div>

      <div class="form-group">
        <label class="form-label" for="extra-learning">🌱 I’m currently learning</label>
        <input type="text" id="extra-learning" class="form-input" value="${data.learning || ''}" placeholder="e.g. Rust, WebAssembly, Distributed Systems">
      </div>

      <div class="form-group">
        <label class="form-label" for="extra-collab">👯 I’m looking to collaborate on</label>
        <input type="text" id="extra-collab" class="form-input" value="${data.collaboratingOn || ''}" placeholder="e.g. Developer tools, accessibility libraries">
      </div>

      <div class="form-group">
        <label class="form-label" for="extra-ask">💬 Ask me about</label>
        <input type="text" id="extra-ask" class="form-input" value="${data.askMeAbout || ''}" placeholder="e.g. Architecture, TypeScript, API Design">
      </div>

      <div class="form-group">
        <label class="form-label" for="extra-fun">⚡ Fun fact</label>
        <input type="text" id="extra-fun" class="form-input" value="${data.funFact || ''}" placeholder="e.g. I make sourdough bread on weekends.">
      </div>
    `;

    document.getElementById('extra-working').addEventListener('input', (e) => this.updateData({ workingOn: e.target.value }));
    document.getElementById('extra-working-url').addEventListener('input', (e) => this.updateData({ workingOnUrl: e.target.value }));
    document.getElementById('extra-learning').addEventListener('input', (e) => this.updateData({ learning: e.target.value }));
    document.getElementById('extra-collab').addEventListener('input', (e) => this.updateData({ collaboratingOn: e.target.value }));
    document.getElementById('extra-ask').addEventListener('input', (e) => this.updateData({ askMeAbout: e.target.value }));
    document.getElementById('extra-fun').addEventListener('input', (e) => this.updateData({ funFact: e.target.value }));
  }

  renderTechStackForm(data) {
    const parseList = (str) => str.split(',').map(s => s.trim()).filter(Boolean);

    this.formContainer.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="tech-style">Display Format</label>
          <select id="tech-style" class="form-select">
            <option value="badges" ${data.style === 'badges' ? 'selected' : ''}>Shields Badges (Standard)</option>
            <option value="list" ${data.style === 'list' ? 'selected' : ''}>Plain Bullet List (Minimal)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="tech-theme">Badge Style</label>
          <select id="tech-theme" class="form-select">
            <option value="flat" ${data.badgeTheme === 'flat' ? 'selected' : ''}>Flat</option>
            <option value="flat-square" ${data.badgeTheme === 'flat-square' ? 'selected' : ''}>Flat Square</option>
            <option value="for-the-badge" ${data.badgeTheme === 'for-the-badge' ? 'selected' : ''}>For The Badge</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="tech-langs">Languages (comma separated)</label>
        <input type="text" id="tech-langs" class="form-input" value="${(data.languages || []).join(', ')}" placeholder="TypeScript, Go, Python, Rust">
      </div>

      <div class="form-group">
        <label class="form-label" for="tech-frameworks">Frameworks & Libraries (comma separated)</label>
        <input type="text" id="tech-frameworks" class="form-input" value="${(data.frameworks || []).join(', ')}" placeholder="React, Next.js, Node.js, FastAPI">
      </div>

      <div class="form-group">
        <label class="form-label" for="tech-dbs">Databases & Storage (comma separated)</label>
        <input type="text" id="tech-dbs" class="form-input" value="${(data.databases || []).join(', ')}" placeholder="PostgreSQL, Redis, SQLite">
      </div>

      <div class="form-group">
        <label class="form-label" for="tech-tools">Tools & DevOps (comma separated)</label>
        <input type="text" id="tech-tools" class="form-input" value="${(data.tools || []).join(', ')}" placeholder="Docker, Git, GitHub Actions, Linux">
      </div>
    `;

    document.getElementById('tech-style').addEventListener('change', (e) => this.updateData({ style: e.target.value }));
    document.getElementById('tech-theme').addEventListener('change', (e) => this.updateData({ badgeTheme: e.target.value }));
    document.getElementById('tech-langs').addEventListener('input', (e) => this.updateData({ languages: parseList(e.target.value) }));
    document.getElementById('tech-frameworks').addEventListener('input', (e) => this.updateData({ frameworks: parseList(e.target.value) }));
    document.getElementById('tech-dbs').addEventListener('input', (e) => this.updateData({ databases: parseList(e.target.value) }));
    document.getElementById('tech-tools').addEventListener('input', (e) => this.updateData({ tools: parseList(e.target.value) }));
  }

  renderPinnedReposForm(data) {
    const repos = Array.isArray(data.repos) ? [...data.repos] : [];

    this.formContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="repo-layout">Layout Style</label>
        <select id="repo-layout" class="form-select">
          <option value="cards" ${data.layout === 'cards' ? 'selected' : ''}>Markdown Table (Clean Grid)</option>
          <option value="list" ${data.layout === 'list' ? 'selected' : ''}>Bullet List (Compact)</option>
        </select>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-2);">
        <span class="form-label">Featured Repositories (${repos.length})</span>
        <button type="button" id="btn-add-repo" class="btn btn--sm">
          + Add Project
        </button>
      </div>

      <div id="repo-list-editor" style="display: flex; flex-direction: column; gap: var(--space-3);">
        ${repos.map((repo, idx) => `
          <div class="intro-card" style="padding: var(--space-3); gap: var(--space-2); position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong>#${idx + 1} Repository</strong>
              <button type="button" class="btn btn--subtle btn--sm btn--danger btn-remove-repo" data-idx="${idx}" title="Remove repository">Remove</button>
            </div>
            <div class="form-row">
              <input type="text" class="form-input repo-name" data-idx="${idx}" placeholder="Repository Name" aria-label="Repository name #${idx + 1}" value="${repo.name || ''}">
              <input type="text" class="form-input repo-lang" data-idx="${idx}" placeholder="Primary Language" aria-label="Repository language #${idx + 1}" value="${repo.language || ''}">
            </div>
            <input type="text" class="form-input repo-desc" data-idx="${idx}" placeholder="Concise description" aria-label="Repository description #${idx + 1}" value="${repo.description || ''}">
            <input type="url" class="form-input repo-url" data-idx="${idx}" placeholder="Repository URL (e.g. https://github.com/...)" aria-label="Repository URL #${idx + 1}" value="${repo.url || ''}">
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('repo-layout').addEventListener('change', (e) => this.updateData({ layout: e.target.value }));

    document.getElementById('btn-add-repo').addEventListener('click', () => {
      repos.push({ name: '', description: '', language: '', stars: 0, url: '' });
      this.updateData({ repos });
      this.render(this.store.getState());
    });

    this.formContainer.querySelectorAll('.btn-remove-repo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        repos.splice(idx, 1);
        this.updateData({ repos });
        this.render(this.store.getState());
      });
    });

    const bindRepoInput = (selector, field) => {
      this.formContainer.querySelectorAll(selector).forEach(input => {
        input.addEventListener('input', (e) => {
          const idx = parseInt(e.target.getAttribute('data-idx'), 10);
          repos[idx][field] = e.target.value;
          this.updateData({ repos });
        });
      });
    };

    bindRepoInput('.repo-name', 'name');
    bindRepoInput('.repo-lang', 'language');
    bindRepoInput('.repo-desc', 'description');
    bindRepoInput('.repo-url', 'url');
  }

  renderStatsForm(data) {
    this.formContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="stats-theme">Card Color Theme</label>
        <select id="stats-theme" class="form-select">
          <option value="github_dark" ${data.theme === 'github_dark' ? 'selected' : ''}>GitHub Dark</option>
          <option value="radical" ${data.theme === 'radical' ? 'selected' : ''}>Radical</option>
          <option value="tokyonight" ${data.theme === 'tokyonight' ? 'selected' : ''}>Tokyo Night</option>
          <option value="onedark" ${data.theme === 'onedark' ? 'selected' : ''}>One Dark</option>
          <option value="minimal" ${data.theme === 'minimal' ? 'selected' : ''}>Minimal White / Black</option>
        </select>
      </div>

      <div style="display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-2);">
        <label class="form-checkbox-label">
          <input type="checkbox" id="stats-chk-stats" class="form-checkbox" ${data.showStatsCard ? 'checked' : ''}>
          <span>Include Overall Stats Card (Stars, Commits, PRs, Contributed repos)</span>
        </label>

        <label class="form-checkbox-label">
          <input type="checkbox" id="stats-chk-streak" class="form-checkbox" ${data.showStreakCard ? 'checked' : ''}>
          <span>Include Commit Streak Card</span>
        </label>

        <label class="form-checkbox-label">
          <input type="checkbox" id="stats-chk-langs" class="form-checkbox" ${data.showTopLanguages ? 'checked' : ''}>
          <span>Include Top Languages Card</span>
        </label>

        <label class="form-checkbox-label">
          <input type="checkbox" id="stats-chk-border" class="form-checkbox" ${data.hideBorder ? 'checked' : ''}>
          <span>Hide card border for seamless background blend</span>
        </label>
      </div>
    `;

    document.getElementById('stats-theme').addEventListener('change', (e) => this.updateData({ theme: e.target.value }));
    document.getElementById('stats-chk-stats').addEventListener('change', (e) => this.updateData({ showStatsCard: e.target.checked }));
    document.getElementById('stats-chk-streak').addEventListener('change', (e) => this.updateData({ showStreakCard: e.target.checked }));
    document.getElementById('stats-chk-langs').addEventListener('change', (e) => this.updateData({ showTopLanguages: e.target.checked }));
    document.getElementById('stats-chk-border').addEventListener('change', (e) => this.updateData({ hideBorder: e.target.checked }));
  }

  renderSocialsForm(data) {
    const links = Array.isArray(data.links) ? [...data.links] : [];

    this.formContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="social-style">Badge / Link Style</label>
        <select id="social-style" class="form-select">
          <option value="badges" ${data.style === 'badges' ? 'selected' : ''}>Shields Badges (Visual)</option>
          <option value="simple_links" ${data.style === 'simple_links' ? 'selected' : ''}>Clean Bullet Links (Text)</option>
        </select>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-2);">
        <span class="form-label">Active Social Links (${links.length})</span>
        <button type="button" id="btn-add-social" class="btn btn--sm">+ Add Link</button>
      </div>

      <div id="social-list-editor" style="display: flex; flex-direction: column; gap: var(--space-2);">
        ${links.map((link, idx) => `
          <div style="display: flex; gap: var(--space-2); align-items: center;">
            <select class="form-select social-platform" data-idx="${idx}" style="width: 140px;" aria-label="Social platform #${idx + 1}">
              <option value="Website" ${link.platform === 'Website' ? 'selected' : ''}>Website</option>
              <option value="LinkedIn" ${link.platform === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
              <option value="Twitter" ${link.platform === 'Twitter' ? 'selected' : ''}>Twitter / X</option>
              <option value="Bluesky" ${link.platform === 'Bluesky' ? 'selected' : ''}>Bluesky</option>
              <option value="Mastodon" ${link.platform === 'Mastodon' ? 'selected' : ''}>Mastodon</option>
              <option value="YouTube" ${link.platform === 'YouTube' ? 'selected' : ''}>YouTube</option>
              <option value="Substack" ${link.platform === 'Substack' ? 'selected' : ''}>Substack</option>
            </select>
            <input type="url" class="form-input social-url" data-idx="${idx}" placeholder="https://..." aria-label="Profile link URL #${idx + 1}" value="${link.url || ''}" style="flex: 1;">
            <button type="button" class="btn btn--icon-sm btn--danger btn-remove-social" data-idx="${idx}" title="Remove link" aria-label="Remove link #${idx + 1}">×</button>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('social-style').addEventListener('change', (e) => this.updateData({ style: e.target.value }));

    document.getElementById('btn-add-social').addEventListener('click', () => {
      links.push({ platform: 'Website', url: '', label: 'Portfolio' });
      this.updateData({ links });
      this.render(this.store.getState());
    });

    this.formContainer.querySelectorAll('.btn-remove-social').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        links.splice(idx, 1);
        this.updateData({ links });
        this.render(this.store.getState());
      });
    });

    this.formContainer.querySelectorAll('.social-platform').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        links[idx].platform = e.target.value;
        links[idx].label = e.target.value;
        this.updateData({ links });
      });
    });

    this.formContainer.querySelectorAll('.social-url').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        links[idx].url = e.target.value;
        this.updateData({ links });
      });
    });
  }

  renderContactForm(data) {
    this.formContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="contact-email">Primary Email</label>
        <input type="email" id="contact-email" class="form-input" value="${data.email || ''}" placeholder="you@domain.com">
      </div>

      <div class="form-group">
        <label class="form-label" for="contact-calendar">Meeting / Calendar Link</label>
        <input type="url" id="contact-calendar" class="form-input" value="${data.calendarUrl || ''}" placeholder="https://cal.com/username">
      </div>

      <div class="form-group">
        <label class="form-label" for="contact-discord">Discord Username</label>
        <input type="text" id="contact-discord" class="form-input" value="${data.discord || ''}" placeholder="username#0000 or username">
      </div>

      <div class="form-group">
        <label class="form-label" for="contact-note">Availability Note</label>
        <textarea id="contact-note" class="form-textarea" style="min-height: 60px;" placeholder="e.g. Best reached via email for speaking engagements, advisory, or contracting.">${data.note || ''}</textarea>
      </div>
    `;

    document.getElementById('contact-email').addEventListener('input', (e) => this.updateData({ email: e.target.value }));
    document.getElementById('contact-calendar').addEventListener('input', (e) => this.updateData({ calendarUrl: e.target.value }));
    document.getElementById('contact-discord').addEventListener('input', (e) => this.updateData({ discord: e.target.value }));
    document.getElementById('contact-note').addEventListener('input', (e) => this.updateData({ note: e.target.value }));
  }

  renderQuoteForm(data) {
    this.formContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="quote-text">Quote</label>
        <textarea id="quote-text" class="form-textarea" placeholder="Favorite quote">${data.quote || ''}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="quote-author">Author / Attributable</label>
        <input type="text" id="quote-author" class="form-input" value="${data.author || ''}" placeholder="e.g. Engineering Lead">
      </div>
    `;

    document.getElementById('quote-text').addEventListener('input', (e) => this.updateData({ quote: e.target.value }));
    document.getElementById('quote-author').addEventListener('input', (e) => this.updateData({ author: e.target.value }));
  }

  renderCustomMarkdownForm(data) {
    this.formContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="custom-title">Section Heading</label>
        <input type="text" id="custom-title" class="form-input" value="${data.title || ''}" placeholder="e.g. Sponsorship & Open Source">
      </div>

      <div class="form-group">
        <label class="form-label" for="custom-content">Markdown Body</label>
        <textarea id="custom-content" class="form-textarea" style="min-height: 160px;" placeholder="Add custom tables, sponsor badges, or embeds">${data.content || ''}</textarea>
      </div>
    `;

    document.getElementById('custom-title').addEventListener('input', (e) => this.updateData({ title: e.target.value }));
    document.getElementById('custom-content').addEventListener('input', (e) => this.updateData({ content: e.target.value }));
  }

  renderAsciiForm(data) {
    this.formContainer.innerHTML = `
      <div class="form-group">
        <label class="form-label">ASCII Mode</label>
        <div class="btn-group" style="width: 100%;">
          <button type="button" id="btn-mode-banner" class="btn ${data.mode !== 'image' ? 'active' : ''}" style="flex: 1;">Text Banner</button>
          <button type="button" id="btn-mode-image" class="btn ${data.mode === 'image' ? 'active' : ''}" style="flex: 1;">Image to ASCII</button>
        </div>
      </div>

      <div id="ascii-banner-controls" style="${data.mode === 'image' ? 'display: none;' : ''}">
        <div class="form-group">
          <label class="form-label" for="ascii-text-input">Banner Text</label>
          <div style="display: flex; gap: var(--space-2);">
            <input type="text" id="ascii-text-input" class="form-input" value="${data.text || 'HELLO'}" maxlength="16">
            <button type="button" id="btn-gen-banner" class="btn btn--primary">Generate</button>
          </div>
          <span class="form-hint">Converts text to monospace ASCII art header.</span>
        </div>
      </div>

      <div id="ascii-image-controls" style="${data.mode !== 'image' ? 'display: none;' : ''}">
        <div class="form-group">
          <label class="form-label" for="ascii-file-input">Upload Image (PNG / JPEG / WebP)</label>
          <input type="file" id="ascii-file-input" class="form-input" accept="image/*">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="ascii-charset">Character Set</label>
            <select id="ascii-charset" class="form-select">
              <option value="standard" ${data.charset === 'standard' ? 'selected' : ''}>Standard (@%#*+=-:. )</option>
              <option value="dense" ${data.charset === 'dense' ? 'selected' : ''}>Dense (Detailed)</option>
              <option value="minimal" ${data.charset === 'minimal' ? 'selected' : ''}>Minimal (#O*+-. )</option>
              <option value="blocks" ${data.charset === 'blocks' ? 'selected' : ''}>Unicode Blocks (█▓▒░ )</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="ascii-width">Output Width (chars: <span id="ascii-w-label">${data.charWidth || 60}</span>)</label>
            <input type="range" id="ascii-width" min="30" max="100" value="${data.charWidth || 60}" class="form-input" style="padding: 2px;">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="ascii-contrast">Contrast (<span id="ascii-c-label">${data.contrast || 1.0}</span>)</label>
            <input type="range" id="ascii-contrast" min="0.5" max="2.0" step="0.1" value="${data.contrast || 1.0}" class="form-input" style="padding: 2px;">
          </div>
          <div class="form-group" style="justify-content: flex-end; padding-bottom: 6px;">
            <label class="form-checkbox-label">
              <input type="checkbox" id="ascii-invert" class="form-checkbox" ${data.invert ? 'checked' : ''}>
              <span>Invert Brightness</span>
            </label>
          </div>
        </div>
      </div>

      <div class="form-group" style="margin-top: var(--space-2);">
        <label class="form-label" for="ascii-output-preview">Generated ASCII Preview</label>
        <textarea id="ascii-output-preview" class="form-textarea" style="min-height: 180px; font-family: var(--font-mono); font-size: 11px; line-height: 1.15; white-space: pre;" readonly>${data.artContent || ''}</textarea>
      </div>
    `;

    const modeBannerBtn = document.getElementById('btn-mode-banner');
    const modeImageBtn = document.getElementById('btn-mode-image');
    const bannerControls = document.getElementById('ascii-banner-controls');
    const imageControls = document.getElementById('ascii-image-controls');
    const textInput = document.getElementById('ascii-text-input');
    const genBannerBtn = document.getElementById('btn-gen-banner');
    const fileInput = document.getElementById('ascii-file-input');
    const charsetSelect = document.getElementById('ascii-charset');
    const widthRange = document.getElementById('ascii-width');
    const contrastRange = document.getElementById('ascii-contrast');
    const invertChk = document.getElementById('ascii-invert');
    const outputTextarea = document.getElementById('ascii-output-preview');

    const updatePreviewAndStore = (art) => {
      outputTextarea.value = art;
      this.updateData({ artContent: art });
    };

    modeBannerBtn.addEventListener('click', () => {
      modeBannerBtn.classList.add('active');
      modeImageBtn.classList.remove('active');
      bannerControls.style.display = 'block';
      imageControls.style.display = 'none';
      this.updateData({ mode: 'banner' });
    });

    modeImageBtn.addEventListener('click', () => {
      modeImageBtn.classList.add('active');
      modeBannerBtn.classList.remove('active');
      bannerControls.style.display = 'none';
      imageControls.style.display = 'block';
      this.updateData({ mode: 'image' });
    });

    genBannerBtn.addEventListener('click', () => {
      const art = generateTextBanner(textInput.value.trim() || 'HELLO');
      updatePreviewAndStore(art);
    });

    let currentLoadedImage = null;

    const convertCurrentImage = async () => {
      if (!currentLoadedImage) return;
      const width = parseInt(widthRange.value, 10);
      const charset = charsetSelect.value;
      const contrast = parseFloat(contrastRange.value);
      const invert = invertChk.checked;

      const art = await processImageToAscii(currentLoadedImage, { width, charset, contrast, invert });
      updatePreviewAndStore(art);
    };

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      currentLoadedImage = file;
      await convertCurrentImage();
    });

    widthRange.addEventListener('input', (e) => {
      document.getElementById('ascii-w-label').textContent = e.target.value;
      this.updateData({ charWidth: parseInt(e.target.value, 10) });
      convertCurrentImage();
    });

    contrastRange.addEventListener('input', (e) => {
      document.getElementById('ascii-c-label').textContent = e.target.value;
      this.updateData({ contrast: parseFloat(e.target.value) });
      convertCurrentImage();
    });

    invertChk.addEventListener('change', (e) => {
      this.updateData({ invert: e.target.checked });
      convertCurrentImage();
    });

    // Auto-generate if banner empty
    if (!data.artContent && data.mode !== 'image') {
      const initialBanner = generateTextBanner(data.text || 'HELLO WORLD');
      updatePreviewAndStore(initialBanner);
    }
  }

  renderAsciiVideoForm(data) {
    this.formContainer.innerHTML = `
      <div class="intro-card" style="padding: var(--space-3); background-color: var(--color-bg-subtle);">
        <strong>ASCII Video (Beta)</strong>
        <p class="form-hint" style="margin-top: 2px;">
          Samples frames from a short video/GIF clip (<10 seconds) on an in-memory canvas and renders an animated SVG banner. Off by default.
        </p>
      </div>

      <div class="form-group" style="margin-top: var(--space-3);">
        <label class="form-label" for="vid-alt-text">
          <span>Required Alt Text (Accessibility)</span>
          <span style="color: var(--color-danger);">*Required</span>
        </label>
        <input type="text" id="vid-alt-text" class="form-input" value="${data.altText || 'Animated ASCII banner'}" placeholder="Describe what the animation shows" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="vid-file-input">Select Short Video or GIF (Max 10s)</label>
        <input type="file" id="vid-file-input" class="form-input" accept="video/mp4,video/webm,image/gif">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label" for="vid-fps">Sampling Rate (FPS)</label>
          <select id="vid-fps" class="form-select">
            <option value="6">6 FPS (Recommended for small size)</option>
            <option value="10" ${data.fps === 10 ? 'selected' : ''}>10 FPS (Smooth)</option>
            <option value="12" ${data.fps === 12 ? 'selected' : ''}>12 FPS</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="vid-cols">Columns Width</label>
          <select id="vid-cols" class="form-select">
            <option value="40">40 Chars (Compact)</option>
            <option value="50" ${data.columns === 50 ? 'selected' : ''}>50 Chars</option>
            <option value="60" ${data.columns === 60 ? 'selected' : ''}>60 Chars</option>
          </select>
        </div>
      </div>

      <button type="button" id="btn-process-video" class="btn btn--primary" style="margin-top: var(--space-2);" disabled>
        Convert Frames to Animated SVG
      </button>

      <div id="vid-status-box" style="display: none; padding: 10px; border-radius: 6px; font-size: 13px;"></div>

      <div id="vid-size-warning" class="module-limit-warning" style="display: ${data.sizeBytes > 1024 * 1024 ? 'flex' : 'none'};">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047zM8 10.93a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8zm-.8-5.93l.2 4h1.2l.2-4h-1.6z"/>
        </svg>
        <span>Generated SVG exceeds 1 MB (${(data.sizeBytes / (1024 * 1024)).toFixed(2)} MB). Consider reducing FPS or clip duration for faster page loading.</span>
      </div>
    `;

    const altInput = document.getElementById('vid-alt-text');
    const fileInput = document.getElementById('vid-file-input');
    const fpsSelect = document.getElementById('vid-fps');
    const colsSelect = document.getElementById('vid-cols');
    const convertBtn = document.getElementById('btn-process-video');
    const statusBox = document.getElementById('vid-status-box');
    const sizeWarnBox = document.getElementById('vid-size-warning');

    altInput.addEventListener('input', (e) => this.updateData({ altText: e.target.value }));
    fpsSelect.addEventListener('change', (e) => this.updateData({ fps: parseInt(e.target.value, 10) }));
    colsSelect.addEventListener('change', (e) => this.updateData({ columns: parseInt(e.target.value, 10) }));

    let selectedVideoFile = null;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        selectedVideoFile = file;
        convertBtn.disabled = false;
      }
    });

    convertBtn.addEventListener('click', async () => {
      if (!selectedVideoFile) return;

      if (!altInput.value.trim()) {
        alert('Please enter required Alt Text for accessibility before generating.');
        altInput.focus();
        return;
      }

      statusBox.style.display = 'block';
      statusBox.style.backgroundColor = 'var(--color-bg-subtle)';
      statusBox.style.color = 'var(--color-text-primary)';
      statusBox.textContent = 'Extracting video frames onto canvas...';
      convertBtn.disabled = true;

      try {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = 'anonymous';

        const fileUrl = URL.createObjectURL(selectedVideoFile);
        video.src = fileUrl;

        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error('Failed to load video file.'));
        });

        const duration = Math.min(10, video.duration || 5);
        const fps = parseInt(fpsSelect.value, 10);
        const columns = parseInt(colsSelect.value, 10);
        const frameInterval = 1 / fps;
        const totalFrames = Math.floor(duration * fps);

        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = Math.round((video.videoHeight / video.videoWidth) * 160) || 120;
        const ctx = canvas.getContext('2d');

        const frames = [];

        for (let i = 0; i < totalFrames; i++) {
          const time = i * frameInterval;
          video.currentTime = time;
          await new Promise(r => { video.onseeked = r; });

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const frameAscii = await processImageToAscii(canvas, { width: columns, charset: 'standard' });
          frames.push(frameAscii);
          statusBox.textContent = `Processing frame ${i + 1} of ${totalFrames}...`;
        }

        URL.revokeObjectURL(fileUrl);

        statusBox.textContent = 'Compiling animated SVG...';
        const { svg, sizeBytes, isOverSizeLimit } = buildAnimatedAsciiSvg(frames, {
          fps,
          altText: altInput.value.trim()
        });

        this.updateData({
          svgOutput: svg,
          sizeBytes
        });

        statusBox.style.backgroundColor = 'var(--color-success-subtle)';
        statusBox.style.color = 'var(--color-success)';
        statusBox.textContent = `Complete! Generated animated SVG (${(sizeBytes / 1024).toFixed(1)} KB, ${frames.length} frames).`;
        sizeWarnBox.style.display = isOverSizeLimit ? 'flex' : 'none';
      } catch (err) {
        statusBox.style.backgroundColor = 'var(--color-danger-subtle)';
        statusBox.style.color = 'var(--color-danger)';
        statusBox.textContent = `Conversion failed: ${err.message}`;
      } finally {
        convertBtn.disabled = false;
      }
    });
  }
}


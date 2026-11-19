/**
 * Live Preview Controller
 * Debounces preview rendering (<200ms), parses markdown via pinned Marked,
 * sanitizes with pinned DOMPurify, handles GitHub light/dark styling and mobile width.
 */

export class PreviewController {
  constructor(store) {
    this.store = store;
    this.previewContainer = document.getElementById('preview-container');
    this.previewBody = document.getElementById('preview-body-container');
    this.rawTextarea = document.getElementById('raw-markdown-textarea');
    this.rawContainer = document.getElementById('raw-source-container');

    this.tabPreviewBtn = document.getElementById('tab-btn-preview');
    this.tabRawBtn = document.getElementById('tab-btn-raw');

    this.btnGhLight = document.getElementById('btn-gh-light');
    this.btnGhDark = document.getElementById('btn-gh-dark');
    this.btnToggleViewport = document.getElementById('btn-toggle-viewport');

    this.debounceTimer = null;
    this.init();
  }

  init() {
    // 1. Tab switching
    if (this.tabPreviewBtn && this.tabRawBtn) {
      this.tabPreviewBtn.addEventListener('click', () => {
        this.store.dispatch({ type: 'SET_PREVIEW_TAB', payload: 'preview' });
      });

      this.tabRawBtn.addEventListener('click', () => {
        this.store.dispatch({ type: 'SET_PREVIEW_TAB', payload: 'markdown' });
      });
    }

    // 2. GitHub Theme toggle (Light vs Dark)
    if (this.btnGhLight && this.btnGhDark) {
      this.btnGhLight.addEventListener('click', () => {
        this.store.dispatch({ type: 'SET_PREVIEW_THEME', payload: 'light' });
      });

      this.btnGhDark.addEventListener('click', () => {
        this.store.dispatch({ type: 'SET_PREVIEW_THEME', payload: 'dark' });
      });
    }

    // 3. Mobile viewport toggle (full vs 375px)
    if (this.btnToggleViewport) {
      this.btnToggleViewport.addEventListener('click', () => {
        const current = this.store.getState().previewWidth;
        const next = current === 'mobile' ? 'full' : 'mobile';
        this.store.dispatch({ type: 'SET_PREVIEW_WIDTH', payload: next });
      });
    }

    // Configure marked options
    if (window.marked) {
      window.marked.setOptions({
        gfm: true,
        breaks: true
      });
    }

    // Render initial
    this.render(this.store.getState());
  }

  /**
   * Schedule render with 100ms debounce (well under the 200ms limit)
   */
  queueRender(state) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.render(state);
    }, 100);
  }

  /**
   * Performs the actual HTML compilation and DOM update
   */
  render(state) {
    const { markdown, previewTheme, previewWidth, previewTab, githubUsername } = state;

    // Update simulated repository title
    const chromeRepoEl = document.getElementById('preview-chrome-repo');
    if (chromeRepoEl) {
      const u = githubUsername || 'username';
      chromeRepoEl.textContent = `${u} / README.md`;
    }

    // Apply GitHub dark/light mode class
    if (this.previewContainer) {
      if (previewTheme === 'light') {
        this.previewContainer.classList.remove('preview-dark');
        this.previewContainer.classList.add('preview-light');
        this.btnGhLight?.classList.add('active');
        this.btnGhDark?.classList.remove('active');
      } else {
        this.previewContainer.classList.remove('preview-light');
        this.previewContainer.classList.add('preview-dark');
        this.btnGhDark?.classList.add('active');
        this.btnGhLight?.classList.remove('active');
      }

      // Apply mobile viewport width constraint
      if (previewWidth === 'mobile') {
        this.previewContainer.classList.add('preview-container--mobile');
        this.btnToggleViewport?.classList.add('active');
        this.btnToggleViewport?.setAttribute('aria-pressed', 'true');
      } else {
        this.previewContainer.classList.remove('preview-container--mobile');
        this.btnToggleViewport?.classList.remove('active');
        this.btnToggleViewport?.setAttribute('aria-pressed', 'false');
      }
    }

    // Handle Tab View (Preview vs Raw Markdown)
    if (previewTab === 'markdown') {
      this.tabRawBtn?.classList.add('active');
      this.tabRawBtn?.setAttribute('aria-selected', 'true');
      this.tabPreviewBtn?.classList.remove('active');
      this.tabPreviewBtn?.setAttribute('aria-selected', 'false');

      if (this.rawContainer) this.rawContainer.style.display = 'block';
      if (this.previewBody) this.previewBody.style.display = 'none';
      if (this.rawTextarea) this.rawTextarea.value = markdown;
    } else {
      this.tabPreviewBtn?.classList.add('active');
      this.tabPreviewBtn?.setAttribute('aria-selected', 'true');
      this.tabRawBtn?.classList.remove('active');
      this.tabRawBtn?.setAttribute('aria-selected', 'false');

      if (this.rawContainer) this.rawContainer.style.display = 'none';
      if (this.previewBody) this.previewBody.style.display = 'block';

      if (this.previewBody && window.marked && window.DOMPurify) {
        try {
          const rawHtml = window.marked.parse(markdown || '');
          const safeHtml = window.DOMPurify.sanitize(rawHtml, {
            ADD_TAGS: ['iframe', 'svg', 'tspan', 'rect', 'path', 'g'],
            ADD_ATTR: ['target', 'align', 'viewBox', 'width', 'height', 'fill', 'stroke', 'rx', 'xmlns', 'role', 'aria-label']
          });
          this.previewBody.innerHTML = safeHtml || '<p style="color: var(--color-text-muted); font-style: italic;">No modules enabled. Tick a module in the left sidebar to add content to your README.</p>';
        } catch (err) {
          console.error('Failed to parse markdown:', err);
        }
      }
    }
  }
}


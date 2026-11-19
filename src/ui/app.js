/**
 * Main Application Bootstrap (src/ui/app.js)
 * Coordinates UI components, store subscriptions, landing page, export workflows,
 * keyboard shortcuts, and responsive mobile navigation.
 */

import { store } from '../core/state.js';
import { fetchGitHubPublicData } from '../core/github.js';
import { initTheme } from './theme.js';
import { PreviewController } from './preview.js';
import { ModuleListComponent } from './components/module-list.js';
import { ModuleEditorComponent } from './components/module-editor.js';
import { PublishModalComponent } from './components/publish-modal.js';
import { QualityBarComponent } from './components/quality-bar.js';

// Pre-load template definitions
const TEMPLATES = {};

async function loadTemplates() {
  const templateNames = ['minimal', 'developer', 'open_source', 'freelancer', 'creator'];
  for (const name of templateNames) {
    try {
      const res = await fetch(`src/core/templates/${name}.json`);
      if (res.ok) {
        TEMPLATES[name] = await res.json();
      }
    } catch (e) {
      console.warn(`Could not load template ${name}:`, e);
    }
  }
}

/**
 * Visual Toast Notifications
 * @param {string} message
 * @param {'info'|'success'|'error'} [type]
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.2s ease-out';
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}

/**
 * Trigger file download for README.md
 * @param {string} content
 */
function downloadReadmeFile(content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'README.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Downloaded README.md', 'success');
}

/**
 * Copy markdown to clipboard
 * @param {string} content
 */
async function copyMarkdownToClipboard(content) {
  try {
    await navigator.clipboard.writeText(content);
    showToast('Copied Markdown to clipboard', 'success');
  } catch (err) {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = content;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied Markdown to clipboard', 'success');
  }
}

/**
 * Handle GitHub data pre-fill
 */
async function handleGitHubPrefill(rawUsername, statusEl = null) {
  const username = (rawUsername || '').trim();
  if (!username) {
    if (statusEl) statusEl.textContent = 'Please enter a GitHub username.';
    return;
  }

  if (statusEl) {
    statusEl.textContent = `Fetching public profile for "${username}"...`;
    statusEl.style.color = 'var(--color-accent)';
  }

  try {
    const data = await fetchGitHubPublicData(username);
    store.dispatch({
      type: 'PREFILL_GITHUB_DATA',
      payload: { profile: data.profile, repos: data.repos }
    });

    const msg = data.fromCache
      ? `Loaded @${username} (from 10-min cache)`
      : `Imported profile & repos for @${username}`;
    showToast(msg, 'success');

    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.style.color = 'var(--color-success)';
    }
  } catch (err) {
    console.warn('GitHub fetch error:', err);
    const errMsg = err.message || 'Could not fetch GitHub profile.';
    showToast(errMsg, 'error');
    if (statusEl) {
      statusEl.textContent = errMsg;
      statusEl.style.color = 'var(--color-danger)';
    }
  }
}

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await loadTemplates();

  // Initialize theme
  initTheme(store);

  // Initialize UI components
  const preview = new PreviewController(store);
  const moduleList = new ModuleListComponent(store);
  const moduleEditor = new ModuleEditorComponent(store);
  const qualityBar = new QualityBarComponent(store);
  new PublishModalComponent(store);

  // Elements
  const introScreen = document.getElementById('intro-screen');
  const mainWorkspace = document.getElementById('main-workspace');
  const introForm = document.getElementById('intro-github-form');
  const introUsernameInput = document.getElementById('intro-username-input');
  const prefillStatus = document.getElementById('prefill-status');
  const templateSelect = document.getElementById('template-select');
  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');

  const btnExportMenu = document.getElementById('btn-export-menu');
  const exportDropdown = document.getElementById('export-dropdown');
  const btnCopyMd = document.getElementById('btn-copy-md');
  const btnDownloadMd = document.getElementById('btn-download-md');

  // Landing screen vs Workspace view toggle
  function updateScreenVisibility(hasStarted) {
    if (hasStarted) {
      if (introScreen) introScreen.style.display = 'none';
      if (mainWorkspace) mainWorkspace.style.display = 'grid';
    } else {
      if (introScreen) introScreen.style.display = 'flex';
      if (mainWorkspace) mainWorkspace.style.display = 'none';
    }
  }

  // Handle Landing Screen GitHub form
  introForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = introUsernameInput?.value.trim();
    if (username) {
      await handleGitHubPrefill(username, prefillStatus);
    } else {
      store.dispatch({ type: 'START_BUILDER' });
    }
  });

  // Handle Landing Screen Template selection cards
  document.querySelectorAll('.btn-template-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const tId = btn.getAttribute('data-template');
      if (TEMPLATES[tId]) {
        store.dispatch({ type: 'APPLY_TEMPLATE', payload: TEMPLATES[tId] });
      }
      store.dispatch({ type: 'START_BUILDER' });
    });
  });

  // Header template dropdown
  templateSelect?.addEventListener('change', (e) => {
    const tId = e.target.value;
    if (TEMPLATES[tId]) {
      store.dispatch({ type: 'APPLY_TEMPLATE', payload: TEMPLATES[tId] });
      showToast(`Applied ${TEMPLATES[tId].name} template`, 'info');
    }
  });

  // Undo & Redo buttons
  btnUndo?.addEventListener('click', () => store.dispatch({ type: 'UNDO' }));
  btnRedo?.addEventListener('click', () => store.dispatch({ type: 'REDO' }));

  // Global Keyboard Shortcuts (Ctrl+Z / Cmd+Z for undo, Ctrl+Y or Shift+Ctrl+Z for redo)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      // Allow native form undo inside inputs unless custom target
      return;
    }
    const isMeta = e.ctrlKey || e.metaKey;
    if (isMeta && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        store.dispatch({ type: 'REDO' });
      } else {
        store.dispatch({ type: 'UNDO' });
      }
    } else if (isMeta && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      store.dispatch({ type: 'REDO' });
    }
  });

  // Export dropdown menu
  btnExportMenu?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = exportDropdown.style.display === 'block';
    exportDropdown.style.display = isExpanded ? 'none' : 'block';
    btnExportMenu.setAttribute('aria-expanded', (!isExpanded).toString());
  });

  document.addEventListener('click', (e) => {
    if (!exportDropdown?.contains(e.target) && e.target !== btnExportMenu) {
      if (exportDropdown) exportDropdown.style.display = 'none';
      btnExportMenu?.setAttribute('aria-expanded', 'false');
    }
  });

  btnCopyMd?.addEventListener('click', () => {
    copyMarkdownToClipboard(store.getState().markdown);
    if (exportDropdown) exportDropdown.style.display = 'none';
  });

  btnDownloadMd?.addEventListener('click', () => {
    downloadReadmeFile(store.getState().markdown);
    if (exportDropdown) exportDropdown.style.display = 'none';
  });

  // Mobile Bottom Tab Switching
  const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');
  const panes = {
    'pane-modules': document.getElementById('pane-modules'),
    'pane-editor': document.getElementById('pane-editor'),
    'pane-preview': document.getElementById('pane-preview')
  };

  function switchMobileTab(targetTabId) {
    mobileNavBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === targetTabId);
    });

    Object.keys(panes).forEach(id => {
      if (panes[id]) {
        panes[id].classList.toggle('active-tab', id === targetTabId);
      }
    });
  }

  mobileNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchMobileTab(tabId);
    });
  });

  window.addEventListener('readmecraft:switch-mobile-tab', (e) => {
    if (e.detail?.tab) {
      switchMobileTab(e.detail.tab);
    }
  });

  window.addEventListener('readmecraft:sync-github', (e) => {
    if (e.detail?.username) {
      handleGitHubPrefill(e.detail.username);
    }
  });

  // Central store subscription: synchronize UI state
  store.subscribe((state) => {
    updateScreenVisibility(state.hasStarted);

    // Update Undo / Redo disabled states
    if (btnUndo) btnUndo.disabled = !state.canUndo;
    if (btnRedo) btnRedo.disabled = !state.canRedo;

    // Notify child components
    preview.queueRender(state);
    moduleList.render(state);
    moduleEditor.render(state);
    qualityBar.render(state);
  });

  // Initial render
  updateScreenVisibility(store.getState().hasStarted);
  preview.render(store.getState());
});


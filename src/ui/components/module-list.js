/**
 * Module List Component (Left Sidebar)
 * Renders draggable module items, toggle checkboxes, keyboard accessible reorder buttons,
 * active selection highlights, and module threshold warning (>8 modules).
 */

import { setupDragDrop } from '../dragdrop.js';

export class ModuleListComponent {
  constructor(store) {
    this.store = store;
    this.container = document.getElementById('module-list-container');
    this.countLabel = document.getElementById('module-count-label');
    this.warningBox = document.getElementById('module-warning-box');
    this.btnProfessional = document.getElementById('btn-preset-pro');
    this.btnClear = document.getElementById('btn-preset-clear');
    this.workspaceUsernameInput = document.getElementById('workspace-username-input');
    this.btnRefreshGh = document.getElementById('btn-workspace-refresh-gh');

    this.init();
  }

  init() {
    // Setup preset actions
    this.btnProfessional?.addEventListener('click', () => {
      this.store.dispatch({ type: 'APPLY_PRESET', payload: 'professional' });
    });

    this.btnClear?.addEventListener('click', () => {
      this.store.dispatch({ type: 'APPLY_PRESET', payload: 'clear_all' });
    });

    // Username sync in workspace
    if (this.workspaceUsernameInput) {
      this.workspaceUsernameInput.addEventListener('change', (e) => {
        this.store.dispatch({ type: 'SET_GITHUB_USERNAME', payload: e.target.value.trim() });
      });
    }

    if (this.btnRefreshGh) {
      this.btnRefreshGh.addEventListener('click', () => {
        const username = this.workspaceUsernameInput?.value.trim() || this.store.getState().githubUsername;
        if (username) {
          window.dispatchEvent(new CustomEvent('readmecraft:sync-github', { detail: { username } }));
        }
      });
    }

    // Initialize native drag and drop
    if (this.container) {
      setupDragDrop(this.container, (fromIndex, toIndex) => {
        this.store.dispatch({
          type: 'REORDER_MODULES',
          payload: { fromIndex, toIndex }
        });
      });
    }

    this.render(this.store.getState());
  }

  render(state) {
    if (!this.container) return;

    const { modules, activeModuleId, githubUsername } = state;
    const activeCount = modules.filter(m => m.enabled).length;

    // Update count label
    if (this.countLabel) {
      this.countLabel.textContent = `Modules (${activeCount}/${modules.length})`;
    }

    // Toggle >8 module warning
    if (this.warningBox) {
      this.warningBox.style.display = activeCount > 8 ? 'flex' : 'none';
    }

    // Sync username input if changed
    if (this.workspaceUsernameInput && document.activeElement !== this.workspaceUsernameInput) {
      this.workspaceUsernameInput.value = githubUsername || '';
    }

    // Render items
    this.container.innerHTML = '';

    modules.forEach((mod, index) => {
      const li = document.createElement('li');
      li.className = `module-item ${mod.id === activeModuleId ? 'active' : ''}`;
      li.setAttribute('draggable', 'true');
      li.setAttribute('data-id', mod.id);
      li.setAttribute('data-index', index.toString());

      // Left part (drag handle, checkbox, title button)
      const leftDiv = document.createElement('div');
      leftDiv.className = 'module-item-left';

      // Drag Handle
      const handle = document.createElement('span');
      handle.className = 'module-drag-handle';
      handle.setAttribute('title', 'Drag to reorder');
      handle.setAttribute('aria-hidden', 'true');
      handle.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-4 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </svg>
      `;

      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `mod-toggle-${mod.id}`;
      checkbox.name = `mod-toggle-${mod.id}`;
      checkbox.className = 'form-checkbox';
      checkbox.checked = mod.enabled;
      checkbox.setAttribute('aria-label', `Include ${mod.title} in README`);
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        this.store.dispatch({
          type: 'TOGGLE_MODULE',
          payload: { id: mod.id, enabled: e.target.checked }
        });
      });

      // Module Title Button (clicking selects this module in editor)
      const titleBtn = document.createElement('button');
      titleBtn.type = 'button';
      titleBtn.className = 'module-label-btn';
      titleBtn.textContent = mod.title;
      titleBtn.addEventListener('click', () => {
        this.store.dispatch({ type: 'SET_ACTIVE_MODULE', payload: mod.id });
        // On mobile, automatically switch to editor tab
        window.dispatchEvent(new CustomEvent('readmecraft:switch-mobile-tab', { detail: { tab: 'pane-editor' } }));
      });

      leftDiv.appendChild(handle);
      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(titleBtn);

      // Right part: Accessible Keyboard Move Up / Down Buttons
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'module-item-actions';

      const moveUpBtn = document.createElement('button');
      moveUpBtn.type = 'button';
      moveUpBtn.className = 'module-move-btn btn--icon-sm';
      moveUpBtn.title = `Move ${mod.title} up`;
      moveUpBtn.setAttribute('aria-label', `Move ${mod.title} up`);
      moveUpBtn.disabled = index === 0;
      moveUpBtn.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 3.5l4.5 4.5h-3v4.5h-3V8H3.5L8 3.5z"/>
        </svg>
      `;
      moveUpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (index > 0) {
          this.store.dispatch({
            type: 'REORDER_MODULES',
            payload: { fromIndex: index, toIndex: index - 1 }
          });
        }
      });

      const moveDownBtn = document.createElement('button');
      moveDownBtn.type = 'button';
      moveDownBtn.className = 'module-move-btn btn--icon-sm';
      moveDownBtn.title = `Move ${mod.title} down`;
      moveDownBtn.setAttribute('aria-label', `Move ${mod.title} down`);
      moveDownBtn.disabled = index === modules.length - 1;
      moveDownBtn.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 12.5l-4.5-4.5h3V3.5h3V8h3l-4.5 4.5z"/>
        </svg>
      `;
      moveDownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (index < modules.length - 1) {
          this.store.dispatch({
            type: 'REORDER_MODULES',
            payload: { fromIndex: index, toIndex: index + 1 }
          });
        }
      });

      actionsDiv.appendChild(moveUpBtn);
      actionsDiv.appendChild(moveDownBtn);

      li.appendChild(leftDiv);
      li.appendChild(actionsDiv);
      this.container.appendChild(li);
    });
  }
}


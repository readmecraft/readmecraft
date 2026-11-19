/**
 * Central State Store
 * Implements a lightweight flux/redux style reactive store with subscribe & dispatch.
 * Includes undo/redo history tracking and automatic debounced draft persistence.
 * Framework-agnostic: does not touch the DOM.
 */

import { getDefaultModules, getProfessionalPreset, clearAllModules, updateModuleData, toggleModuleEnabled, reorderModules } from './modules.js';
import { HistoryStack } from './history.js';
import { saveDraft, loadDraft, getStoredTheme } from './storage.js';
import { generateMarkdown } from './markdown.js';
import { auditProfile } from './quality.js';

/**
 * Creates initial default application state
 * @returns {object}
 */
export function getInitialState() {
  const savedDraft = loadDraft();
  const theme = getStoredTheme();
  const defaultModules = getDefaultModules();

  if (savedDraft && Array.isArray(savedDraft.modules)) {
    // Merge saved draft with current module schema to ensure backwards compatibility
    const savedModulesMap = new Map(savedDraft.modules.map(m => [m.id, m]));
    const mergedModules = defaultModules.map(defMod => {
      const saved = savedModulesMap.get(defMod.id);
      if (!saved) return defMod;
      return {
        ...defMod,
        enabled: saved.enabled,
        data: {
          ...defMod.data,
          ...saved.data
        }
      };
    });

    const activeId = savedDraft.activeModuleId || mergedModules[0].id;
    const initialMd = generateMarkdown(mergedModules, { githubUsername: savedDraft.githubUsername || '' });
    const quality = auditProfile(mergedModules, initialMd);

    return {
      hasStarted: Boolean(savedDraft.hasStarted),
      theme,
      previewTheme: savedDraft.previewTheme || 'dark',
      previewWidth: savedDraft.previewWidth || 'full', // 'full' | 'mobile'
      previewTab: savedDraft.previewTab || 'preview', // 'preview' | 'markdown'
      activeModuleId: activeId,
      githubUsername: savedDraft.githubUsername || '',
      profileCache: savedDraft.profileCache || null,
      modules: mergedModules,
      markdown: initialMd,
      quality,
      canUndo: false,
      canRedo: false
    };
  }

  const initialMd = generateMarkdown(defaultModules, { githubUsername: '' });
  const quality = auditProfile(defaultModules, initialMd);

  return {
    hasStarted: false,
    theme,
    previewTheme: 'dark',
    previewWidth: 'full',
    previewTab: 'preview',
    activeModuleId: defaultModules[0].id,
    githubUsername: '',
    profileCache: null,
    modules: defaultModules,
    markdown: initialMd,
    quality,
    canUndo: false,
    canRedo: false
  };
}

/**
 * Store implementation
 */
export class Store {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = new Set();
    this.history = new HistoryStack(40);
    this.history.reset(this.state.modules);
    this.saveTimeout = null;
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  /**
   * Schedule draft save to localStorage (debounced)
   */
  scheduleDraftSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      saveDraft({
        hasStarted: this.state.hasStarted,
        activeModuleId: this.state.activeModuleId,
        githubUsername: this.state.githubUsername,
        profileCache: this.state.profileCache,
        previewTheme: this.state.previewTheme,
        previewWidth: this.state.previewWidth,
        modules: this.state.modules
      });
    }, 400);
  }

  /**
   * Main dispatch reducer
   * @param {object} action
   * @param {string} action.type
   * @param {any} [action.payload]
   */
  dispatch(action) {
    const prevModules = this.state.modules;
    let nextModules = prevModules;
    let pushHistory = false;
    let nextState = { ...this.state };

    switch (action.type) {
      case 'START_BUILDER': {
        nextState.hasStarted = true;
        break;
      }

      case 'SET_THEME': {
        nextState.theme = action.payload;
        break;
      }

      case 'SET_PREVIEW_THEME': {
        nextState.previewTheme = action.payload; // 'dark' | 'light'
        break;
      }

      case 'SET_PREVIEW_WIDTH': {
        nextState.previewWidth = action.payload; // 'full' | 'mobile'
        break;
      }

      case 'SET_PREVIEW_TAB': {
        nextState.previewTab = action.payload; // 'preview' | 'markdown'
        break;
      }

      case 'SET_ACTIVE_MODULE': {
        nextState.activeModuleId = action.payload;
        break;
      }

      case 'TOGGLE_MODULE': {
        const { id, enabled } = action.payload;
        nextModules = toggleModuleEnabled(this.state.modules, id, enabled);
        pushHistory = true;
        break;
      }

      case 'UPDATE_MODULE_DATA': {
        const { id, data } = action.payload;
        nextModules = updateModuleData(this.state.modules, id, data);
        pushHistory = true;
        break;
      }

      case 'REORDER_MODULES': {
        const { fromIndex, toIndex } = action.payload;
        nextModules = reorderModules(this.state.modules, fromIndex, toIndex);
        pushHistory = true;
        break;
      }

      case 'APPLY_PRESET': {
        if (action.payload === 'professional') {
          nextModules = getProfessionalPreset(this.state.modules);
        } else if (action.payload === 'clear_all') {
          nextModules = clearAllModules(this.state.modules);
        }
        pushHistory = true;
        break;
      }

      case 'APPLY_TEMPLATE': {
        const template = action.payload;
        if (template && Array.isArray(template.enabledModules)) {
          nextModules = this.state.modules.map(mod => {
            const isEnabled = template.enabledModules.includes(mod.id);
            const override = template.moduleOverrides && template.moduleOverrides[mod.id];
            return {
              ...mod,
              enabled: isEnabled,
              data: override ? { ...mod.data, ...override } : mod.data
            };
          });
          pushHistory = true;
        }
        break;
      }

      case 'SET_GITHUB_USERNAME': {
        nextState.githubUsername = action.payload;
        break;
      }

      case 'PREFILL_GITHUB_DATA': {
        const { profile, repos } = action.payload;
        nextState.hasStarted = true;
        nextState.githubUsername = profile.login || nextState.githubUsername;
        nextState.profileCache = { profile, repos };

        // Pre-fill header, bio, pinned repos, stats, socials
        nextModules = this.state.modules.map(mod => {
          if (mod.id === 'header') {
            return {
              ...mod,
              enabled: true,
              data: {
                ...mod.data,
                name: profile.name || profile.login || mod.data.name,
                tagline: profile.bio || mod.data.tagline
              }
            };
          }
          if (mod.id === 'bio') {
            return {
              ...mod,
              enabled: true,
              data: {
                ...mod.data,
                company: profile.company || mod.data.company,
                location: profile.location || mod.data.location,
                bioText: profile.bio || mod.data.bioText
              }
            };
          }
          if (mod.id === 'pinned_repos' && repos && repos.length > 0) {
            return {
              ...mod,
              enabled: true,
              data: {
                ...mod.data,
                repos: repos.map(r => ({
                  name: r.name,
                  owner: r.owner,
                  description: r.description,
                  language: r.language,
                  stars: r.stars,
                  url: r.url
                }))
              }
            };
          }
          if (mod.id === 'socials') {
            const links = [...mod.data.links];
            if (profile.blog) {
              const siteLink = links.find(l => l.platform === 'Website');
              if (siteLink) siteLink.url = profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`;
            }
            if (profile.twitter) {
              const twLink = links.find(l => l.platform === 'Twitter');
              if (twLink) twLink.url = `https://x.com/${profile.twitter}`;
            }
            return {
              ...mod,
              enabled: true,
              data: { ...mod.data, links }
            };
          }
          return mod;
        });
        pushHistory = true;
        break;
      }

      case 'UNDO': {
        const undoneModules = this.history.undo();
        if (undoneModules) {
          nextModules = undoneModules;
        }
        break;
      }

      case 'REDO': {
        const redoneModules = this.history.redo();
        if (redoneModules) {
          nextModules = redoneModules;
        }
        break;
      }

      default:
        return;
    }

    if (pushHistory) {
      this.history.push(nextModules);
    }

    // Recalculate derived markdown and quality score if modules or username changed
    nextState.modules = nextModules;
    nextState.markdown = generateMarkdown(nextModules, { githubUsername: nextState.githubUsername });
    nextState.quality = auditProfile(nextModules, nextState.markdown);
    nextState.canUndo = this.history.canUndo();
    nextState.canRedo = this.history.canRedo();

    this.state = nextState;
    this.scheduleDraftSave();
    this.notify();
  }
}

/**
 * Global store singleton for the app
 */
export const store = new Store(getInitialState());


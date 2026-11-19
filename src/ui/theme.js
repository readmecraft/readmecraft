/**
 * Theme manager for ReadmeCraft
 * Manages system / dark / light modes and persists preferences.
 */

import { getStoredTheme, setStoredTheme } from '../core/storage.js';

const THEME_ORDER = ['system', 'dark', 'light'];

export function initTheme(store) {
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const faviconEl = document.getElementById('app-favicon');

  function applyTheme(theme) {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', 'system');
      updateIcon(prefersDark ? 'dark' : 'light');
      updateFavicon(prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
      updateIcon(theme);
      updateFavicon(theme);
    }
  }

  function updateFavicon(effectiveTheme) {
    if (!faviconEl) return;
    faviconEl.href = effectiveTheme === 'dark' ? 'assets/favicon_dark.png' : 'assets/favicon_light.png';
  }

  function updateIcon(effectiveTheme) {
    if (!themeIcon) return;
    if (effectiveTheme === 'dark') {
      // Moon icon
      themeIcon.innerHTML = `<path d="M9.598 1.591a.75.75 0 0 1 .785-.175 7 7 0 1 1-8.959 8.959.75.75 0 0 1 .634-.96 5.5 5.5 0 0 0 7.54-7.54.75.75 0 0 1-.001-.284z"/>`;
      themeToggleBtn.setAttribute('title', 'Theme: Dark (click for Light)');
    } else {
      // Sun icon
      themeIcon.innerHTML = `<path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0zm0 13a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13zM2.343 2.343a.75.75 0 0 1 1.061 0l1.06 1.061a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06zm9.193 9.193a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061zM0 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8zm13 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 13 8zM2.343 13.657a.75.75 0 0 1 0-1.06l1.06-1.061a.75.75 0 1 1 1.062 1.06l-1.061 1.061a.75.75 0 0 1-1.061 0zm9.193-9.193a.75.75 0 0 1 0-1.06l1.06-1.061a.75.75 0 1 1 1.062 1.06l-1.061 1.061a.75.75 0 0 1-1.061 0z"/>`;
      themeToggleBtn.setAttribute('title', 'Theme: Light (click for System)');
    }
  }

  // Initial setup
  const currentTheme = getStoredTheme();
  applyTheme(currentTheme);

  // Listen to system dark mode change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (store.getState().theme === 'system') {
      applyTheme('system');
    }
  });

  // Cycle theme on click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = store.getState().theme || 'system';
      const currentIndex = THEME_ORDER.indexOf(current);
      const nextTheme = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];

      setStoredTheme(nextTheme);
      store.dispatch({ type: 'SET_THEME', payload: nextTheme });
      applyTheme(nextTheme);
    });
  }
}


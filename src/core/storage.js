/**
 * LocalStorage wrapper with error handling, schema versioning, and cache expiration.
 * Framework-agnostic: does not touch the DOM.
 */

const STORAGE_KEY_PREFIX = 'readmecraft_';
const DRAFT_KEY = `${STORAGE_KEY_PREFIX}draft_v1`;
const GITHUB_CACHE_KEY = `${STORAGE_KEY_PREFIX}gh_cache_v1`;
const THEME_KEY = `${STORAGE_KEY_PREFIX}theme_v1`;

/**
 * Save draft state to localStorage
 * @param {object} data
 * @returns {boolean} Success status
 */
export function saveDraft(data) {
  try {
    const payload = {
      version: 1,
      savedAt: Date.now(),
      data
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn('Failed to save draft to localStorage:', err);
    return false;
  }
}

/**
 * Load draft state from localStorage
 * @returns {object|null}
 */
export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1 && parsed.data) {
      return parsed.data;
    }
    return null;
  } catch (err) {
    console.warn('Failed to parse draft from localStorage:', err);
    return null;
  }
}

/**
 * Clear saved draft
 */
export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.warn('Failed to clear draft:', err);
  }
}

/**
 * Cache GitHub profile data for 10 minutes
 * @param {string} username
 * @param {object} profileData
 */
export function cacheGitHubProfile(username, profileData) {
  try {
    const raw = localStorage.getItem(GITHUB_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[username.toLowerCase()] = {
      timestamp: Date.now(),
      data: profileData
    };
    localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn('Failed to cache GitHub data:', err);
  }
}

/**
 * Retrieve cached GitHub profile data if less than 10 minutes old
 * @param {string} username
 * @returns {object|null}
 */
export function getCachedGitHubProfile(username) {
  try {
    const raw = localStorage.getItem(GITHUB_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const entry = cache[username.toLowerCase()];
    if (!entry) return null;

    const TEN_MINUTES_MS = 10 * 60 * 1000;
    if (Date.now() - entry.timestamp > TEN_MINUTES_MS) {
      return null; // Expired
    }
    return entry.data;
  } catch (err) {
    return null;
  }
}

/**
 * Get saved theme preference
 * @returns {'system'|'dark'|'light'}
 */
export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'system';
  } catch {
    return 'system';
  }
}

/**
 * Set saved theme preference
 * @param {'system'|'dark'|'light'} theme
 */
export function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.warn('Failed to store theme preference:', err);
  }
}


/**
 * GitHub API Client
 * - Pre-fill: Unauthenticated public profile and repos fetch with 10-minute cache & rate-limit handling.
 * - Publish: In-memory token authentication, username/username repository creation, and README commit via contents API.
 * Framework-agnostic: pure async functions. Never persists or leaks access tokens.
 */

import { getCachedGitHubProfile, cacheGitHubProfile } from './storage.js';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Standardized error object with human-friendly message
 * @param {string} message
 * @param {number} [status]
 * @returns {Error}
 */
function createGitHubError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Parses GitHub rate limit headers from Response
 * @param {Response} response
 * @returns {string} Human-readable rate limit status
 */
function formatRateLimitMessage(response) {
  const remaining = response.headers.get('x-ratelimit-remaining');
  const resetUnix = response.headers.get('x-ratelimit-reset');

  if (resetUnix) {
    const resetDate = new Date(parseInt(resetUnix, 10) * 1000);
    const minutesLeft = Math.max(1, Math.ceil((resetDate.getTime() - Date.now()) / 60000));
    return `GitHub API rate limit exceeded (60 unauthenticated requests/hour). Resets in approximately ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`;
  }
  return 'GitHub API rate limit exceeded. Please wait a few minutes or enter your details manually.';
}

/**
 * Encode string to base64 with full UTF-8 support
 * @param {string} str
 * @returns {string}
 */
export function utf8ToBase64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

/**
 * Fetches user profile and top repositories from GitHub REST API (unauthenticated)
 * @param {string} rawUsername
 * @returns {Promise<{ profile: object, repos: Array<object>, fromCache: boolean }>}
 */
export async function fetchGitHubPublicData(rawUsername) {
  const username = rawUsername.trim();
  if (!username) {
    throw createGitHubError('Please provide a valid GitHub username.');
  }

  // 1. Check cache first
  const cached = getCachedGitHubProfile(username);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  try {
    // 2. Fetch user profile
    const userRes = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (userRes.status === 404) {
      throw createGitHubError(`GitHub user "${username}" was not found. Please check spelling.`);
    }

    if (userRes.status === 403 || userRes.status === 429) {
      throw createGitHubError(formatRateLimitMessage(userRes), userRes.status);
    }

    if (!userRes.ok) {
      throw createGitHubError(`GitHub API returned status ${userRes.status}.`, userRes.status);
    }

    const profileData = await userRes.json();

    // 3. Fetch top public repositories
    let reposData = [];
    try {
      const reposRes = await fetch(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12&type=owner`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );

      if (reposRes.ok) {
        const allRepos = await reposRes.json();
        if (Array.isArray(allRepos)) {
          // Filter out forks if there are sufficient source repos, sort by stars
          const nonForks = allRepos.filter(r => !r.fork);
          const pool = nonForks.length >= 3 ? nonForks : allRepos;
          reposData = pool
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6)
            .map(r => ({
              name: r.name,
              owner: r.owner?.login || username,
              description: r.description || '',
              language: r.language || 'Code',
              stars: r.stargazers_count || 0,
              url: r.html_url
            }));
        }
      }
    } catch (e) {
      console.warn('Could not fetch top repositories:', e);
    }

    const result = {
      profile: {
        login: profileData.login,
        name: profileData.name || profileData.login,
        bio: profileData.bio || '',
        company: (profileData.company || '').replace(/^@/, ''),
        location: profileData.location || '',
        blog: profileData.blog || '',
        twitter: profileData.twitter_username || '',
        avatarUrl: profileData.avatar_url,
        publicRepos: profileData.public_repos,
        followers: profileData.followers
      },
      repos: reposData
    };

    // Store in 10-minute cache
    cacheGitHubProfile(username, result);

    return { ...result, fromCache: false };
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw createGitHubError('Network error connecting to GitHub. Check your internet connection.');
    }
    throw err;
  }
}

/**
 * Publishes README.md to user's username/username repository
 * Handles in-memory auth, repository creation if needed, and file SHA lookup.
 *
 * @param {object} params
 * @param {string} params.token - Fine-grained or classic GitHub Personal Access Token
 * @param {string} params.markdown - The README content
 * @param {string} [params.commitMessage] - Custom commit message
 * @param {function} [params.onProgress] - Progress callback
 * @returns {Promise<{ repoUrl: string, profileUrl: string, commitSha: string }>}
 */
export async function publishReadmeToGitHub({ token, markdown, commitMessage, onProgress }) {
  const cleanToken = (token || '').trim();
  if (!cleanToken) {
    throw createGitHubError('Personal Access Token is required to publish.');
  }

  const authHeaders = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${cleanToken}`
  };

  const progress = (msg) => {
    if (typeof onProgress === 'function') onProgress(msg);
  };

  // Step 1: Validate token and get authenticated user
  progress('Validating token credentials with GitHub...');
  const authUserRes = await fetch(`${GITHUB_API_BASE}/user`, { headers: authHeaders });

  if (authUserRes.status === 401) {
    throw createGitHubError('Authentication failed: The Personal Access Token is invalid or has expired.');
  }
  if (!authUserRes.ok) {
    throw createGitHubError(`Failed to authenticate with GitHub (HTTP ${authUserRes.status}).`);
  }

  const authUser = await authUserRes.json();
  const username = authUser.login;
  const repoName = username;

  // Step 2: Check if username/username repository exists
  progress(`Checking for profile repository "${username}/${repoName}"...`);
  const repoCheckRes = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repoName}`, {
    headers: authHeaders
  });

  if (repoCheckRes.status === 404) {
    // Repository does not exist. Create it!
    progress(`Creating special profile repository "${username}/${repoName}"...`);
    const createRepoRes = await fetch(`${GITHUB_API_BASE}/user/repos`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: `${username}'s personal GitHub profile README`,
        homepage: `https://github.com/${username}`,
        private: false,
        has_issues: false,
        has_projects: false,
        has_wiki: false,
        auto_init: true
      })
    });

    if (createRepoRes.status === 403) {
      throw createGitHubError(
        `Unable to create repository "${username}/${repoName}". Your token may lack repository creation permissions (Administration: Read and write or classic "repo" scope).`
      );
    }

    if (!createRepoRes.ok) {
      const errData = await createRepoRes.json().catch(() => ({}));
      throw createGitHubError(errData.message || `Failed to create repository (HTTP ${createRepoRes.status}).`);
    }

    // Wait 1.5 seconds for GitHub's git database to initialize the repository
    await new Promise(resolve => setTimeout(resolve, 1500));
  } else if (!repoCheckRes.ok && repoCheckRes.status !== 200) {
    throw createGitHubError(`Could not access repository "${username}/${repoName}" (HTTP ${repoCheckRes.status}).`);
  }

  // Step 3: Get existing README.md SHA (needed by GitHub contents API to update an existing file)
  progress('Checking existing README.md commit history...');
  let existingSha = null;
  const fileCheckRes = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repoName}/contents/README.md`, {
    headers: authHeaders
  });

  if (fileCheckRes.ok) {
    const fileData = await fileCheckRes.json();
    existingSha = fileData.sha;
  }

  // Step 4: Commit README.md
  progress('Committing updated README.md...');
  const commitPayload = {
    message: commitMessage || 'docs: update profile README.md via ReadmeCraft',
    content: utf8ToBase64(markdown)
  };

  if (existingSha) {
    commitPayload.sha = existingSha;
  }

  const commitRes = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repoName}/contents/README.md`, {
    method: 'PUT',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commitPayload)
  });

  if (commitRes.status === 401) {
    throw createGitHubError('Personal Access Token rejected by GitHub.');
  }

  if (commitRes.status === 403) {
    throw createGitHubError(
      'Token does not have write access to this repository. Ensure the token scope includes "Contents: Read and write".'
    );
  }

  if (commitRes.status === 409) {
    throw createGitHubError('Conflict: README.md was modified concurrently. Please retry.');
  }

  if (!commitRes.ok) {
    const errData = await commitRes.json().catch(() => ({}));
    throw createGitHubError(errData.message || `Failed to commit README.md (HTTP ${commitRes.status}).`);
  }

  const commitData = await commitRes.json();
  progress('Profile README published successfully!');

  return {
    repoUrl: `https://github.com/${username}/${repoName}`,
    profileUrl: `https://github.com/${username}`,
    commitSha: commitData.commit?.sha || ''
  };
}


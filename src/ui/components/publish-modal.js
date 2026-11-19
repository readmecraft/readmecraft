/**
 * Publish Modal Dialog Component
 * Handles the publishing lifecycle to username/username repository via GitHub REST API.
 * Keeps token purely in-memory; clears on modal close. Never touches storage or analytics.
 */

import { publishReadmeToGitHub } from '../../core/github.js';

export class PublishModalComponent {
  constructor(store) {
    this.store = store;
    this.backdrop = document.getElementById('publish-modal-backdrop');
    this.closeBtn = document.getElementById('btn-publish-modal-close');
    this.cancelBtn = document.getElementById('btn-publish-cancel');
    this.submitBtn = document.getElementById('btn-publish-submit');
    this.openBtn = document.getElementById('btn-publish-open');
    this.tokenInput = document.getElementById('publish-token-input');
    this.commitMsgInput = document.getElementById('publish-commit-msg');
    this.consentChk = document.getElementById('publish-consent-chk');
    this.statusBox = document.getElementById('publish-status-box');
    this.repoTarget = document.getElementById('publish-repo-target');
    this.form = document.getElementById('publish-form');

    this.init();
  }

  init() {
    this.openBtn?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.cancelBtn?.addEventListener('click', () => this.close());

    // Prevent default form submission and trigger publish
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePublish();
    });

    // Click outside dialog to close
    this.backdrop?.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    // Escape key to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.backdrop?.classList.contains('open')) {
        this.close();
      }
    });

    // Submit publish
    this.submitBtn?.addEventListener('click', () => this.handlePublish());
  }

  open() {
    const username = this.store.getState().githubUsername || 'username';
    if (this.repoTarget) {
      this.repoTarget.textContent = `${username}/${username}`;
    }

    if (this.statusBox) {
      this.statusBox.style.display = 'none';
      this.statusBox.textContent = '';
    }

    if (this.tokenInput) {
      this.tokenInput.value = '';
    }

    if (this.submitBtn) {
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Publish README';
    }

    this.backdrop?.classList.add('open');
    setTimeout(() => this.tokenInput?.focus(), 50);
  }

  close() {
    // Clear token from DOM and memory immediately
    if (this.tokenInput) {
      this.tokenInput.value = '';
    }
    if (this.consentChk) {
      this.consentChk.checked = false;
    }
    this.backdrop?.classList.remove('open');
  }

  setStatus(message, type = 'info') {
    if (!this.statusBox) return;
    this.statusBox.style.display = 'block';

    if (type === 'error') {
      this.statusBox.style.backgroundColor = 'var(--color-danger-subtle)';
      this.statusBox.style.color = 'var(--color-danger)';
      this.statusBox.style.border = '1px solid var(--color-danger)';
    } else if (type === 'success') {
      this.statusBox.style.backgroundColor = 'var(--color-success-subtle)';
      this.statusBox.style.color = 'var(--color-success)';
      this.statusBox.style.border = '1px solid var(--color-success)';
    } else {
      this.statusBox.style.backgroundColor = 'var(--color-bg-subtle)';
      this.statusBox.style.color = 'var(--color-text-primary)';
      this.statusBox.style.border = '1px solid var(--color-border-default)';
    }

    this.statusBox.innerHTML = message;
  }

  async handlePublish() {
    const token = this.tokenInput?.value.trim();
    const commitMessage = this.commitMsgInput?.value.trim() || 'docs: update profile README.md';
    const markdown = this.store.getState().markdown;

    if (!token) {
      this.setStatus('Please enter your GitHub Personal Access Token.', 'error');
      this.tokenInput?.focus();
      return;
    }

    if (this.consentChk && !this.consentChk.checked) {
      this.setStatus('Please acknowledge the privacy & token transmission consent before publishing.', 'error');
      this.consentChk.focus();
      return;
    }

    this.submitBtn.disabled = true;
    this.setStatus('Connecting to GitHub API...', 'info');

    try {
      const result = await publishReadmeToGitHub({
        token,
        markdown,
        commitMessage,
        onProgress: (msg) => this.setStatus(msg, 'info')
      });

      // Show success screen
      this.setStatus(`
        <strong>Published successfully!</strong>
        <p style="margin-top: 4px;">Your profile README has been committed to <code>${result.repoUrl}</code>.</p>
        <p style="margin-top: 8px;">
          <a href="${result.profileUrl}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; text-decoration: underline;">
            View your GitHub Profile →
          </a>
        </p>
      `, 'success');

      // Clear token input after publishing
      if (this.tokenInput) this.tokenInput.value = '';
      this.submitBtn.textContent = 'Published!';
    } catch (err) {
      this.setStatus(err.message || 'An unexpected error occurred while publishing.', 'error');
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Retry Publish';
    }
  }
}


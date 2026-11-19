/**
 * Quality Score Indicator & Audit Modal Component
 * Displays real-time profile completeness score in header and opens full breakdown modal.
 */

export class QualityBarComponent {
  constructor(store) {
    this.store = store;
    this.badgeBtn = document.getElementById('quality-trigger');
    this.scoreText = document.getElementById('quality-score');
    this.modalBackdrop = document.getElementById('quality-modal-backdrop');
    this.modalScore = document.getElementById('quality-modal-score');
    this.modalList = document.getElementById('quality-warnings-list');
    this.closeBtn = document.getElementById('btn-quality-modal-close');
    this.okBtn = document.getElementById('btn-quality-modal-ok');

    this.init();
  }

  init() {
    this.badgeBtn?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.okBtn?.addEventListener('click', () => this.close());

    this.modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === this.modalBackdrop) this.close();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalBackdrop?.classList.contains('open')) {
        this.close();
      }
    });

    this.render(this.store.getState());
  }

  open() {
    this.modalBackdrop?.classList.add('open');
  }

  close() {
    this.modalBackdrop?.classList.remove('open');
  }

  render(state) {
    const { quality } = state;
    if (!quality) return;

    const { score, warnings } = quality;

    // Header badge
    if (this.scoreText) {
      this.scoreText.textContent = `${score}%`;
    }

    if (this.badgeBtn) {
      this.badgeBtn.classList.remove('quality-badge--high', 'quality-badge--medium', 'quality-badge--low');
      if (score >= 80) {
        this.badgeBtn.classList.add('quality-badge--high');
      } else if (score >= 60) {
        this.badgeBtn.classList.add('quality-badge--medium');
      } else {
        this.badgeBtn.classList.add('quality-badge--low');
      }
    }

    // Modal view
    if (this.modalScore) {
      this.modalScore.textContent = `${score}%`;
      this.modalScore.style.color = score >= 80 ? 'var(--color-success)' : (score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)');
    }

    if (this.modalList) {
      if (warnings.length === 0) {
        this.modalList.innerHTML = `
          <div style="padding: 12px; background-color: var(--color-success-subtle); border: 1px solid var(--color-success); border-radius: 6px; color: var(--color-success); font-size: 13px;">
            ✓ All checks passed! Clean links, accessible descriptions, and well-balanced modules.
          </div>
        `;
      } else {
        this.modalList.innerHTML = warnings.map(w => {
          const color = w.level === 'error' ? 'var(--color-danger)' : (w.level === 'warn' ? 'var(--color-warning)' : 'var(--color-text-secondary)');
          const bg = w.level === 'error' ? 'var(--color-danger-subtle)' : (w.level === 'warn' ? 'var(--color-warning-subtle)' : 'var(--color-bg-subtle)');
          return `
            <div style="padding: 10px; background-color: ${bg}; border-left: 3px solid ${color}; border-radius: 4px; font-size: 13px; color: var(--color-text-primary);">
              ${w.text}
            </div>
          `;
        }).join('');
      }
    }
  }
}


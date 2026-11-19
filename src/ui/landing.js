/**
 * Landing Page Controller (src/ui/landing.js)
 * Manages landing hero form navigation, interactive preview simulation,
 * template selection shortcuts, and privacy consent.
 */

import { initTheme } from './theme.js';
import { store } from '../core/state.js';

// Sample README Markdown for the Landing Hero Preview
const SAMPLE_MARKDOWN = `# Alex Rivera

**Full-Stack & Systems Engineer** &bull; Building resilient distributed architectures.
Currently developing high-throughput telemetry pipelines and open-source developer tooling.

---

### Tech Stack

<p align="left">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="32" height="32"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="32" height="32"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" alt="Next.js" width="32" height="32"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg" alt="Go" width="32" height="32"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/rust/rust-original.svg" alt="Rust" width="32" height="32"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width="32" height="32"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" alt="Docker" width="32" height="32"/>
</p>

### Featured Projects

| Repository | Description | Tech |
| :--- | :--- | :--- |
| **hyper-fetch** | Ultra-lightweight HTTP client with automatic retries and zero dependencies. | TypeScript |
| **cli-toolkit** | Composable terminal utilities for high-throughput pipeline workflows. | Go |

### Connect with Me

<p align="left">
  <a href="https://github.com" target="_blank" rel="noopener noreferrer"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg" alt="GitHub" width="28" height="28"/></a>
  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><img src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="LinkedIn" width="28" height="28"/></a>
  <a href="https://x.com" target="_blank" rel="noopener noreferrer"><img src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="Twitter" width="28" height="28"/></a>
  <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer"><img src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/leet-code.svg" alt="LeetCode" width="28" height="28"/></a>
</p>
`;

function initLanding() {
  // Initialize theme
  initTheme(store);

  // Hero GitHub Import Form
  const heroForm = document.getElementById('landing-import-form');
  const heroInput = document.getElementById('landing-username-input');

  heroForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = heroInput?.value.trim();
    if (user) {
      window.location.href = `editor.html?user=${encodeURIComponent(user)}`;
    } else {
      window.location.href = 'editor.html';
    }
  });

  // Template Cards Click
  document.querySelectorAll('.btn-use-template').forEach(btn => {
    btn.addEventListener('click', () => {
      const template = btn.getAttribute('data-template');
      window.location.href = `editor.html?template=${encodeURIComponent(template)}`;
    });
  });

  // Hero Interactive Preview Setup
  const previewBody = document.getElementById('landing-preview-body');
  const rawTextarea = document.getElementById('landing-raw-textarea');
  const previewContainer = document.getElementById('landing-preview-container');

  if (previewBody && window.marked && window.DOMPurify) {
    const rawHtml = window.marked.parse(SAMPLE_MARKDOWN, { gfm: true, breaks: true });
    previewBody.innerHTML = window.DOMPurify.sanitize(rawHtml);
  }

  if (rawTextarea) {
    rawTextarea.value = SAMPLE_MARKDOWN;
  }

  // Preview Tabs (Preview / Markdown)
  const tabBtnPreview = document.getElementById('tab-landing-preview');
  const tabBtnRaw = document.getElementById('tab-landing-raw');

  tabBtnPreview?.addEventListener('click', () => {
    tabBtnPreview.classList.add('active');
    tabBtnRaw?.classList.remove('active');
    if (previewBody) previewBody.style.display = 'block';
    if (rawTextarea) rawTextarea.style.display = 'none';
  });

  tabBtnRaw?.addEventListener('click', () => {
    tabBtnRaw.classList.add('active');
    tabBtnPreview?.classList.remove('active');
    if (previewBody) previewBody.style.display = 'none';
    if (rawTextarea) rawTextarea.style.display = 'block';
  });

  // Preview Theme Switcher (Dark / Light)
  const btnPreviewLight = document.getElementById('btn-landing-light');
  const btnPreviewDark = document.getElementById('btn-landing-dark');

  btnPreviewLight?.addEventListener('click', () => {
    btnPreviewLight.classList.add('active');
    btnPreviewDark?.classList.remove('active');
    previewContainer?.classList.remove('preview-dark');
    previewContainer?.classList.add('preview-light');
  });

  btnPreviewDark?.addEventListener('click', () => {
    btnPreviewDark.classList.add('active');
    btnPreviewLight?.classList.remove('active');
    previewContainer?.classList.remove('preview-light');
    previewContainer?.classList.add('preview-dark');
  });

  // Cookie Consent Banner
  const cookieBanner = document.getElementById('cookie-consent-banner');
  const btnCookieAccept = document.getElementById('btn-cookie-accept');

  if (cookieBanner) {
    const hasConsented = localStorage.getItem('readmecraft_consent_v1');
    if (!hasConsented) {
      cookieBanner.style.display = 'flex';
    }
    btnCookieAccept?.addEventListener('click', () => {
      localStorage.setItem('readmecraft_consent_v1', 'accepted');
      cookieBanner.style.display = 'none';
    });
  }

  // Dynamic Copyright Year
  const currentYear = new Date().getFullYear().toString();
  document.querySelectorAll('#landing-copyright-year, #copyright-year').forEach(el => {
    el.textContent = currentYear;
  });

  // Setup Staggered Scroll-Driven Reveal Animations
  const observerOptions = {
    threshold: 0.02,
    rootMargin: '0px 0px 100px 0px'
  };

  const revealEl = (el) => {
    el.classList.add('is-revealed');
  };

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealEl(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      // Assign subtle stagger based on sibling position in grids
      if (!el.style.getPropertyValue('--reveal-delay')) {
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('landing-feature-grid') || 
                       parent.classList.contains('landing-steps-grid') || 
                       parent.classList.contains('landing-template-grid') || 
                       parent.classList.contains('best-practices-grid') || 
                       parent.classList.contains('landing-faq-grid'))) {
          const siblingIndex = Array.from(parent.children).indexOf(el);
          el.style.setProperty('--reveal-delay', `${(siblingIndex % 4) * 60}ms`);
        }
      }

      // Check if already in viewport
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 100) {
        revealEl(el);
      } else {
        scrollObserver.observe(el);
      }
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll('.reveal-on-scroll').forEach(revealEl);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanding);
} else {
  initLanding();
}

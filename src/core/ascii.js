/**
 * ASCII Generation Engine
 * 1. Text Banners: High-legibility custom ASCII banner generator with multiple typography styles.
 * 2. Static Art: Canvas-based pixel luminance sampling with charset, width, and contrast adjustments.
 * 3. Animated Video (Beta): Multi-frame canvas sampling to animated SVG vector banner with size check.
 * Framework-agnostic: pure calculation & canvas transformation.
 */

// Charset dictionaries ordered by luminance (dark to light)
export const CHARSETS = {
  standard: '@%#*+=-:. ',
  dense: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  minimal: '#O*+-. ',
  blocks: '█▓▒░ '
};

// Compact 5-row banner font definition for clean ASCII headers
const FONT_MAP_SLANT = {
  A: ['  __ _  ', ' / _` | ', '| (_| | ', ' \\__,_| '],
  B: [' _     ', '| |__  ', '| \'_ \\ ', '|_.__/ '],
  C: ['  ___  ', ' / __| ', '| (__  ', ' \\___| '],
  D: ['   _   ', ' _| |  ', '(_| |  ', ' \\__,_|'],
  E: ['  ___  ', ' / _ \\ ', '|  __/ ', ' \\___| '],
  F: ['  __   ', ' / _|  ', '| |_   ', '|_|    '],
  G: ['  __ _ ', ' / _` |', '| (_| |', ' \\__, |', ' |___/ '],
  H: [' _     ', '| |__  ', '| \'_ \\ ', '|_| |_|'],
  I: [' _ ', '| |', '| |', '|_|'],
  J: ['    _ ', '   | |', '   | |', ' __/ |', '|___/ '],
  K: [' _    ', '| | __', '| |/ /', '|_|\\_\\'],
  L: [' _ ', '| |', '| |', '|_|'],
  M: [' _ __ ___  ', '| \'_ ` _ \\ ', '| | | | | |', '|_| |_| |_|'],
  N: [' _ __  ', '| \'_ \\ ', '| | | |', '|_| |_|'],
  O: ['  ___  ', ' / _ \\ ', '| (_) |', ' \\___/ '],
  P: [' _ __  ', '| \'_ \\ ', '| |_) |', '| .__/ ', '|_|    '],
  Q: ['  __ _ ', ' / _` |', '| (_| |', ' \\__, |', '    |_|'],
  R: [' _ __  ', '| \'__| ', '| |    ', '|_|    '],
  S: [' ___ ', '/ __|', '\\__ \\', '|___/'],
  T: [' _   ', '| |_ ', '|  _|', ' \\__|'],
  U: [' _   _ ', '| | | |', '| |_| |', ' \\__,_|'],
  V: ['__   __', '\\ \\ / /', ' \\ V / ', '  \\_/  '],
  W: ['__      __', '\\ \\ /\\ / /', ' \\ V  V / ', '  \\_/\\_/  '],
  X: ['__  __', '\\ \\/ /', ' >  < ', '/_/\\_\\'],
  Y: [' _   _ ', '| | | |', '| |_| |', ' \\__, |', ' |___/ '],
  Z: [' ____', '|_  /', ' / / ', '/___|'],
  '0': ['  ___  ', ' / _ \\ ', '| | | |', '| |_| |', ' \\___/ '],
  '1': [' _ ', '/ |', '| |', '|_|'],
  '2': [' ____  ', '|___ \\ ', '  __) |', ' / __/ ', '|_____|'],
  '3': [' _____ ', '|___ / ', '  |_ \\ ', ' ___) |', '|____/ '],
  ' ': ['   ', '   ', '   ', '   '],
  '-': ['     ', ' --- ', '     ', '     '],
  '.': ['   ', '   ', ' . ', '   '],
  '!': [' _ ', '| |', '| |', '|_|', '(_)']
};

/**
 * Generate an ASCII banner from input text
 * @param {string} text
 * @returns {string} Multi-line ASCII text
 */
export function generateTextBanner(text = 'HELLO') {
  const clean = text.toUpperCase().replace(/[^A-Z0-9\s\.\-\!]/g, ' ');
  const rows = ['', '', '', '', ''];

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const glyph = FONT_MAP_SLANT[char] || FONT_MAP_SLANT[' '];
    for (let r = 0; r < 5; r++) {
      rows[r] += glyph[r] || '   ';
    }
  }

  // Filter out completely empty trailing rows
  return rows.filter(r => r.trim().length > 0).join('\n');
}

/**
 * Converts ImageData to ASCII string based on luminance sampling
 * @param {ImageData} imageData
 * @param {number} width - Output column width
 * @param {string} charsetKey - Key for CHARSETS
 * @param {number} contrast - Contrast factor (0.5 to 2.0)
 * @param {boolean} invert - Whether to invert brightness
 * @returns {string}
 */
export function convertImageDataToAscii(imageData, width, charsetKey = 'standard', contrast = 1.0, invert = false) {
  const chars = CHARSETS[charsetKey] || CHARSETS.standard;
  const { data, width: imgW, height: imgH } = imageData;

  // Aspect ratio adjustment for monospace characters (approx 0.55 width/height ratio)
  const fontAspect = 0.55;
  const outW = Math.max(10, Math.min(140, Math.round(width)));
  const outH = Math.max(5, Math.round((imgH / imgW) * outW * fontAspect));

  const xStep = imgW / outW;
  const yStep = imgH / outH;

  const lines = [];

  for (let y = 0; y < outH; y++) {
    let line = '';
    const srcY = Math.min(imgH - 1, Math.floor(y * yStep));

    for (let x = 0; x < outW; x++) {
      const srcX = Math.min(imgW - 1, Math.floor(x * xStep));
      const pixelIndex = (srcY * imgW + srcX) * 4;

      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      const a = data[pixelIndex + 3];

      if (a < 32) {
        // Transparent pixel becomes space
        line += ' ';
        continue;
      }

      // Perceptual grayscale calculation
      let brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Apply contrast
      if (contrast !== 1.0) {
        brightness = (brightness - 0.5) * contrast + 0.5;
        brightness = Math.max(0, Math.min(1, brightness));
      }

      if (invert) {
        brightness = 1.0 - brightness;
      }

      const charIndex = Math.floor(brightness * (chars.length - 1));
      line += chars[charIndex];
    }
    lines.push(line);
  }

  return lines.join('\n');
}

/**
 * Asynchronously processes an image element or blob to ASCII
 * @param {HTMLImageElement|Blob|File} imageSource
 * @param {object} options
 * @returns {Promise<string>}
 */
export async function processImageToAscii(imageSource, options = {}) {
  const width = options.width || 60;
  const charset = options.charset || 'standard';
  const contrast = typeof options.contrast === 'number' ? options.contrast : 1.0;
  const invert = Boolean(options.invert);

  let img;
  if (imageSource instanceof HTMLImageElement) {
    img = imageSource;
  } else {
    img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = URL.createObjectURL(imageSource);
    });
  }

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width || 200;
  canvas.height = img.naturalHeight || img.height || 200;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return convertImageDataToAscii(imageData, width, charset, contrast, invert);
}

/**
 * Builds an animated SVG vector banner from a sequence of ASCII text frames.
 * Uses CSS @keyframes for zero-dependency vector animation.
 *
 * @param {Array<string>} frames - Array of multi-line ASCII frames
 * @param {object} options
 * @param {number} [options.fps=10]
 * @param {string} [options.altText='Animated ASCII Profile Banner']
 * @returns {{ svg: string, sizeBytes: number, isOverSizeLimit: boolean }}
 */
export function buildAnimatedAsciiSvg(frames, options = {}) {
  if (!Array.isArray(frames) || frames.length === 0) {
    return { svg: '', sizeBytes: 0, isOverSizeLimit: false };
  }

  const fps = Math.max(1, Math.min(24, options.fps || 10));
  const altText = (options.altText || 'Animated ASCII Profile Banner').replace(/"/g, '&quot;');
  const totalDuration = (frames.length / fps).toFixed(2);

  // Measure dimension
  const firstFrameLines = frames[0].split('\n');
  const cols = Math.max(...firstFrameLines.map(l => l.length), 20);
  const rows = firstFrameLines.length;

  const charW = 7.2;
  const charH = 14;
  const svgW = Math.round(cols * charW + 24);
  const svgH = Math.round(rows * charH + 24);

  // Build keyframe CSS
  let keyframesCss = `@keyframes cycleFrames {\n`;
  const frameCount = frames.length;
  const pctStep = 100 / frameCount;

  for (let i = 0; i < frameCount; i++) {
    const fromPct = (i * pctStep).toFixed(2);
    const toPct = ((i + 1) * pctStep - 0.01).toFixed(2);
    // Each frame's display is controlled
    keyframesCss += `  ${fromPct}%, ${toPct}% { --active-frame: ${i}; }\n`;
  }
  keyframesCss += `}\n`;

  // Escape XML characters inside ASCII
  const escapeXml = (str) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Text layers with visibility toggled via CSS animation delay
  let textNodes = '';
  frames.forEach((frame, idx) => {
    const lines = frame.split('\n');
    const tspans = lines
      .map((line, lineIdx) => `<tspan x="12" dy="${lineIdx === 0 ? 14 : charH}">${escapeXml(line)}</tspan>`)
      .join('');

    const animName = `f${idx}`;
    textNodes += `
      <g class="frame-group" id="frame-${idx}">
        <text x="12" y="16" class="ascii-text">${tspans}</text>
      </g>
    `;
  });

  // Calculate percentage visibility rules for standard SVG cross-browser compatibility
  let cssRules = `
    .frame-group { display: none; }
    @keyframes showFrame0 { 0%, ${pctStep}% { display: block; } ${(pctStep + 0.01).toFixed(2)}%, 100% { display: none; } }
  `;

  let frameAnimations = '';
  frames.forEach((_, idx) => {
    const start = (idx * pctStep).toFixed(2);
    const end = ((idx + 1) * pctStep).toFixed(2);
    frameAnimations += `
      @keyframes showF${idx} {
        0%, ${(start - 0.01).toFixed(2)}% { display: none; }
        ${start}%, ${end}% { display: block; }
        ${(parseFloat(end) + 0.01).toFixed(2)}%, 100% { display: none; }
      }
      #frame-${idx} {
        animation: showF${idx} ${totalDuration}s infinite;
      }
    `;
  });

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="100%" height="auto" role="img" aria-label="${altText}">
  <style>
    .ascii-bg { fill: #0d1117; }
    .ascii-text { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; fill: #58a6ff; white-space: pre; }
    .frame-group { display: none; }
    ${frameAnimations}
  </style>
  <rect width="100%" height="100%" rx="6" class="ascii-bg"/>
  ${textNodes}
</svg>`;

  const sizeBytes = new Blob([svgContent]).size;
  const ONE_MB = 1024 * 1024;

  return {
    svg: svgContent,
    sizeBytes,
    isOverSizeLimit: sizeBytes > ONE_MB
  };
}


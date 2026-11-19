/**
 * Curated Social Platforms Catalog
 * Provides standardized metadata (name, platform id, category, brand colors, URL prefixes, brand icon SVGs)
 * for the interactive Social section.
 * Framework-agnostic: pure data.
 */

export const SOCIAL_CATEGORIES = [
  { id: 'all', label: 'All Platforms' },
  { id: 'professional', label: 'Professional' },
  { id: 'coding', label: 'Coding & Competitive' },
  { id: 'content', label: 'Blogs & Video' },
  { id: 'social', label: 'Social & Media' },
  { id: 'community', label: 'Community' },
  { id: 'creative', label: 'Design & Creative' }
];

export const SOCIAL_PLATFORMS = [
  {
    id: 'github',
    name: 'GitHub',
    category: 'coding',
    prefix: 'https://github.com/',
    placeholder: 'username',
    color: '181717',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg'
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    category: 'social',
    prefix: 'https://x.com/',
    placeholder: 'username',
    color: '000000',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'professional',
    prefix: 'https://linkedin.com/in/',
    placeholder: 'username',
    color: '0A66C2',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg'
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    category: 'coding',
    prefix: 'https://leetcode.com/u/',
    placeholder: 'username',
    color: 'FFA116',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/leet-code.svg'
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    category: 'coding',
    prefix: 'https://codeforces.com/profile/',
    placeholder: 'username',
    color: '1F8ACB',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/codeforces.svg'
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    category: 'coding',
    prefix: 'https://hackerrank.com/profile/',
    placeholder: 'username',
    color: '2EC866',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/hackerrank.svg'
  },
  {
    id: 'geeksforgeeks',
    name: 'GeeksforGeeks',
    category: 'coding',
    prefix: 'https://auth.geeksforgeeks.org/user/',
    placeholder: 'username',
    color: '2F8D46',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/geeks-for-geeks.svg'
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    category: 'coding',
    prefix: 'https://stackoverflow.com/users/',
    placeholder: 'user_id',
    color: 'F48024',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/stack-overflow.svg'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'content',
    prefix: 'https://youtube.com/@',
    placeholder: 'channel_handle',
    color: 'FF0000',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/youtube.svg'
  },
  {
    id: 'devto',
    name: 'Dev.to',
    category: 'content',
    prefix: 'https://dev.to/',
    placeholder: 'username',
    color: '0A0A0A',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/devdotto.svg'
  },
  {
    id: 'medium',
    name: 'Medium',
    category: 'content',
    prefix: 'https://medium.com/@',
    placeholder: 'username',
    color: '000000',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/medium.svg'
  },
  {
    id: 'hashnode',
    name: 'Hashnode',
    category: 'content',
    prefix: 'https://hashnode.com/@',
    placeholder: 'username',
    color: '2962FF',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/hashnode.svg'
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'community',
    prefix: 'https://discord.gg/',
    placeholder: 'invite_code',
    color: '5865F2',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/discord.svg'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'community',
    prefix: 'https://t.me/',
    placeholder: 'username',
    color: '26A5E4',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/telegram.svg'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    prefix: 'https://instagram.com/',
    placeholder: 'username',
    color: 'E4405F',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg'
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    category: 'coding',
    prefix: 'https://kaggle.com/',
    placeholder: 'username',
    color: '20BEFF',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/kaggle.svg'
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    category: 'social',
    prefix: 'https://bsky.app/profile/',
    placeholder: 'handle.bsky.social',
    color: '1185FE',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/bluesky.svg'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'content',
    prefix: 'https://twitch.tv/',
    placeholder: 'username',
    color: '9146FF',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/twitch.svg'
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    category: 'creative',
    prefix: 'https://dribbble.com/',
    placeholder: 'username',
    color: 'EA4C89',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/dribbble.svg'
  },
  {
    id: 'behance',
    name: 'Behance',
    category: 'creative',
    prefix: 'https://behance.net/',
    placeholder: 'username',
    color: '1769FF',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/behance.svg'
  },
  {
    id: 'codepen',
    name: 'CodePen',
    category: 'creative',
    prefix: 'https://codepen.io/',
    placeholder: 'username',
    color: '000000',
    icon: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/codepen.svg'
  },
  {
    id: 'buymeacoffee',
    name: 'Buy Me a Coffee',
    category: 'community',
    prefix: 'https://buymeacoffee.com/',
    placeholder: 'username',
    color: 'FFDD00',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/buymeacoffee.svg'
  },
  {
    id: 'website',
    name: 'Personal Portfolio',
    category: 'professional',
    prefix: 'https://',
    placeholder: 'yourdomain.com',
    color: '0969DA',
    icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/devicon/devicon-original.svg'
  }
];

/**
 * Find platform by ID or Name
 * @param {string} idOrName
 */
export function findPlatform(idOrName) {
  if (!idOrName) return null;
  const q = idOrName.toLowerCase().trim();
  return SOCIAL_PLATFORMS.find(p => p.id === q || p.name.toLowerCase() === q) || null;
}

/**
 * Format full profile URL from platform prefix and user input
 * @param {object} platform
 * @param {string} input
 */
export function formatProfileUrl(platform, input) {
  if (!input) return '';
  const val = input.trim();
  if (val.startsWith('http://') || val.startsWith('https://')) {
    return val;
  }
  const cleanInput = val.replace(/^@/, '');
  return `${platform.prefix}${cleanInput}`;
}

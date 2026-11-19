/**
 * Curated Skills & Technology Catalog
 * Provides standardized metadata (name, category, brand colors, devicon/simpleicon SVG paths)
 * for interactive skill picking in the profile editor.
 * Framework-agnostic: pure data.
 */

export const SKILL_CATEGORIES = [
  { id: 'languages', label: 'Languages' },
  { id: 'frontend', label: 'Frontend & UI' },
  { id: 'backend', label: 'Backend & APIs' },
  { id: 'database', label: 'Databases & Storage' },
  { id: 'devops', label: 'Cloud & DevOps' },
  { id: 'tools', label: 'Tools & Ecosystem' }
];

export const SKILLS_LIST = [
  // --- Languages ---
  { id: 'typescript', name: 'TypeScript', category: 'languages', color: '3178C6', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' },
  { id: 'javascript', name: 'JavaScript', category: 'languages', color: 'F7DF1E', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg' },
  { id: 'python', name: 'Python', category: 'languages', color: '3776AB', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg' },
  { id: 'go', name: 'Go', category: 'languages', color: '00ADD8', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg' },
  { id: 'rust', name: 'Rust', category: 'languages', color: '000000', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/rust/rust-original.svg' },
  { id: 'java', name: 'Java', category: 'languages', color: '007396', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg' },
  { id: 'cpp', name: 'C++', category: 'languages', color: '00599C', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg' },
  { id: 'c', name: 'C', category: 'languages', color: 'A8B9CC', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/c/c-original.svg' },
  { id: 'csharp', name: 'C#', category: 'languages', color: '239120', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg' },
  { id: 'ruby', name: 'Ruby', category: 'languages', color: 'CC342D', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/ruby/ruby-original.svg' },
  { id: 'php', name: 'PHP', category: 'languages', color: '777BB4', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg' },
  { id: 'swift', name: 'Swift', category: 'languages', color: 'F05138', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/swift/swift-original.svg' },
  { id: 'kotlin', name: 'Kotlin', category: 'languages', color: '7F52FF', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/kotlin/kotlin-original.svg' },
  { id: 'dart', name: 'Dart', category: 'languages', color: '0175C2', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/dart/dart-original.svg' },
  { id: 'html5', name: 'HTML5', category: 'languages', color: 'E34F26', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg' },
  { id: 'css3', name: 'CSS3', category: 'languages', color: '1572B6', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg' },
  { id: 'shell', name: 'Bash / Shell', category: 'languages', color: '4EAA25', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/bash/bash-original.svg' },
  { id: 'lua', name: 'Lua', category: 'languages', color: '2C2D72', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/lua/lua-original.svg' },

  // --- Frontend & UI ---
  { id: 'react', name: 'React', category: 'frontend', color: '61DAFB', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', color: '000000', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg' },
  { id: 'vuejs', name: 'Vue.js', category: 'frontend', color: '4FC08D', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg' },
  { id: 'svelte', name: 'Svelte', category: 'frontend', color: 'FF3E00', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/svelte/svelte-original.svg' },
  { id: 'angular', name: 'Angular', category: 'frontend', color: 'DD0031', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg' },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frontend', color: '06B6D4', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg' },
  { id: 'bootstrap', name: 'Bootstrap', category: 'frontend', color: '7952B3', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-original.svg' },
  { id: 'sass', name: 'Sass', category: 'frontend', color: 'CC6699', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg' },
  { id: 'redux', name: 'Redux', category: 'frontend', color: '764ABC', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg' },
  { id: 'flutter', name: 'Flutter', category: 'frontend', color: '02569B', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/flutter/flutter-original.svg' },

  // --- Backend & APIs ---
  { id: 'nodejs', name: 'Node.js', category: 'backend', color: '339933', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg' },
  { id: 'express', name: 'Express', category: 'backend', color: '000000', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg' },
  { id: 'nestjs', name: 'NestJS', category: 'backend', color: 'E0234E', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-original.svg' },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', color: '009688', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg' },
  { id: 'django', name: 'Django', category: 'backend', color: '092E20', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/django/django-plain.svg' },
  { id: 'flask', name: 'Flask', category: 'backend', color: '000000', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/flask/flask-original.svg' },
  { id: 'spring', name: 'Spring Boot', category: 'backend', color: '6DB33F', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg' },
  { id: 'graphql', name: 'GraphQL', category: 'backend', color: 'E10098', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/graphql/graphql-plain.svg' },
  { id: 'bun', name: 'Bun', category: 'backend', color: 'FBF0DF', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/bun/bun-original.svg' },
  { id: 'deno', name: 'Deno', category: 'backend', color: '000000', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/denojs/denojs-original.svg' },

  // --- Databases & Storage ---
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', color: '4169E1', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg' },
  { id: 'mysql', name: 'MySQL', category: 'database', color: '4479A1', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', color: '47A248', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg' },
  { id: 'redis', name: 'Redis', category: 'database', color: 'DC382D', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg' },
  { id: 'sqlite', name: 'SQLite', category: 'database', color: '003B57', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original.svg' },
  { id: 'firebase', name: 'Firebase', category: 'database', color: 'FFCA28', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg' },
  { id: 'supabase', name: 'Supabase', category: 'database', color: '3ECF8E', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/supabase/supabase-original.svg' },
  { id: 'prisma', name: 'Prisma', category: 'database', color: '2D3748', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/prisma/prisma-original.svg' },

  // --- Cloud & DevOps ---
  { id: 'docker', name: 'Docker', category: 'devops', color: '2496ED', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', color: '326CE5', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg' },
  { id: 'aws', name: 'Amazon Web Services', category: 'devops', color: 'FF9900', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { id: 'googlecloud', name: 'Google Cloud', category: 'devops', color: '4285F4', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/googlecloud/googlecloud-original.svg' },
  { id: 'azure', name: 'Microsoft Azure', category: 'devops', color: '0078D4', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/azure/azure-original.svg' },
  { id: 'linux', name: 'Linux', category: 'devops', color: 'FCC624', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg' },
  { id: 'githubactions', name: 'GitHub Actions', category: 'devops', color: '2088FF', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/githubactions/githubactions-original.svg' },
  { id: 'terraform', name: 'Terraform', category: 'devops', color: '844FBA', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/terraform/terraform-original.svg' },
  { id: 'nginx', name: 'Nginx', category: 'devops', color: '009639', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nginx/nginx-original.svg' },
  { id: 'vercel', name: 'Vercel', category: 'devops', color: '000000', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg' },

  // --- Tools & Ecosystem ---
  { id: 'git', name: 'Git', category: 'tools', color: 'F05032', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg' },
  { id: 'github', name: 'GitHub', category: 'tools', color: '181717', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg' },
  { id: 'gitlab', name: 'GitLab', category: 'tools', color: 'FC6D26', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/gitlab/gitlab-original.svg' },
  { id: 'vscode', name: 'VS Code', category: 'tools', color: '007ACC', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vscode/vscode-original.svg' },
  { id: 'figma', name: 'Figma', category: 'tools', color: 'F24E1E', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg' },
  { id: 'postman', name: 'Postman', category: 'tools', color: 'FF6C37', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postman/postman-original.svg' },
  { id: 'jest', name: 'Jest', category: 'tools', color: 'C21325', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/jest/jest-plain.svg' },
  { id: 'vite', name: 'Vite', category: 'tools', color: '646CFF', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg' },
  { id: 'webpack', name: 'Webpack', category: 'tools', color: '8DD6F9', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/webpack/webpack-original.svg' }
];

/**
 * Lookup skill by name (case-insensitive) or ID
 * @param {string} query
 * @returns {object|undefined}
 */
export function findSkill(query) {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase();
  return SKILLS_LIST.find(s => s.id === clean || s.name.toLowerCase() === clean);
}

import fs from 'node:fs';
import path from 'node:path';

const SOURCE_POSTS = 'd:/文件存档/03_学习提升_Study/前端/blog/source/_posts';
const SOURCE_ROOT = 'd:/文件存档/03_学习提升_Study/前端/blog/source';
const TARGET_CONTENT = 'd:/myProject/blog/src/content/blog';
const TARGET_IMAGES = 'd:/myProject/blog/public/images/posts';
const TARGET_PUBLIC = 'd:/myProject/blog/public';

// Ensure target directories exist
fs.mkdirSync(TARGET_CONTENT, { recursive: true });
fs.mkdirSync(TARGET_IMAGES, { recursive: true });
fs.mkdirSync(TARGET_PUBLIC, { recursive: true });

// 1. Copy root assets
const staticFiles = [
  { src: path.join(SOURCE_ROOT, 'CNAME'), dest: path.join(TARGET_PUBLIC, 'CNAME') },
  { src: path.join(SOURCE_ROOT, 'img/avatar.jpg'), dest: path.join(TARGET_PUBLIC, 'avatar.jpg') },
  { src: path.join(SOURCE_ROOT, 'img/avatar.png'), dest: path.join(TARGET_PUBLIC, 'avatar.png') },
  { src: path.join(SOURCE_ROOT, 'img/favicon.ico'), dest: path.join(TARGET_PUBLIC, 'favicon.ico') },
];

for (const { src, dest } of staticFiles) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied static file: ${path.basename(src)} -> ${dest}`);
  }
}

// 2. Read source posts directory
const entries = fs.readdirSync(SOURCE_POSTS, { withFileTypes: true });

let mdCount = 0;
let dirCount = 0;

// First pass: Copy all asset directories to public/images/posts/
for (const entry of entries) {
  if (entry.isDirectory()) {
    const srcDir = path.join(SOURCE_POSTS, entry.name);
    const destDir = path.join(TARGET_IMAGES, entry.name);
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`Copied asset directory: ${entry.name}`);
    dirCount++;
  }
}

// Helper to extract clean summary
function extractDescription(body) {
  // If there's a <!-- more --> tag, take before it
  let text = body;
  const moreIndex = body.indexOf('<!-- more -->');
  if (moreIndex !== -1) {
    text = body.slice(0, moreIndex);
  }
  // Strip code blocks, headers, images, formatting
  text = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/{%.*?%}/g, '')
    .replace(/#+\s+/g, '')
    .replace(/[*_`>~-]/g, '')
    .trim();
  const firstParagraph = text.split('\n\n').map(s => s.trim()).filter(Boolean)[0] || '';
  return firstParagraph.slice(0, 150).trim();
}

// Second pass: Process markdown posts
for (const entry of entries) {
  if (entry.isFile() && entry.name.endsWith('.md')) {
    const filePath = path.join(SOURCE_POSTS, entry.name);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const slug = entry.name.replace(/\.md$/, '');

    // Split frontmatter and body
    const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
      console.warn(`Warning: Could not parse frontmatter in ${entry.name}`);
      continue;
    }

    const [, rawFrontmatter, rawBody] = match;

    // Parse frontmatter fields simply & reliably
    let title = slug;
    let dateStr = '';
    let categories = [];
    let tags = [];

    const fmLines = rawFrontmatter.split(/\r?\n/);
    let currentList = null;

    for (const line of fmLines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('title:')) {
        title = trimmed.replace(/^title:\s*/, '').replace(/^['"](.*)['"]$/, '$1').trim();
        currentList = null;
      } else if (trimmed.startsWith('date:')) {
        dateStr = trimmed.replace(/^date:\s*/, '').replace(/^['"](.*)['"]$/, '$1').trim();
        currentList = null;
      } else if (trimmed === 'categories:') {
        currentList = 'categories';
      } else if (trimmed === 'tags:') {
        currentList = 'tags';
      } else if (trimmed.startsWith('- ') && currentList) {
        const val = trimmed.replace(/^-\s*/, '').replace(/^['"](.*)['"]$/, '$1').trim();
        if (currentList === 'categories') categories.push(val);
        if (currentList === 'tags') tags.push(val);
      } else if (trimmed.includes(':') && !trimmed.startsWith('-')) {
        currentList = null;
      }
    }

    // Transform asset_img syntax:
    // {% asset_img filename.png alt text %} -> ![alt text](/images/posts/slug/filename.png)
    let transformedBody = rawBody.replace(
      /{%\s*asset_img\s+([^\s]+)(?:\s+(.*?))?\s*%}/g,
      (match, imgFile, altText) => {
        const alt = (altText || imgFile).trim();
        return `![${alt}](/images/posts/${slug}/${imgFile})`;
      }
    );

    // If no description, extract one
    const description = extractDescription(transformedBody);

    // Format new frontmatter
    const newFrontmatterLines = [
      '---',
      `title: ${JSON.stringify(title)}`,
      `date: ${dateStr ? JSON.stringify(dateStr) : JSON.stringify(new Date().toISOString())}`,
      `description: ${JSON.stringify(description)}`,
    ];

    if (categories.length > 0) {
      newFrontmatterLines.push('categories:');
      for (const cat of categories) {
        newFrontmatterLines.push(`  - ${JSON.stringify(cat)}`);
      }
    }

    if (tags.length > 0) {
      newFrontmatterLines.push('tags:');
      for (const tag of tags) {
        newFrontmatterLines.push(`  - ${JSON.stringify(tag)}`);
      }
    }

    newFrontmatterLines.push('---', '');

    const newContent = newFrontmatterLines.join('\n') + transformedBody;
    const destFilePath = path.join(TARGET_CONTENT, entry.name);
    fs.writeFileSync(destFilePath, newContent, 'utf-8');
    mdCount++;
  }
}

console.log(`\nMigration completed successfully!`);
console.log(`- Migrated Markdown Posts: ${mdCount}`);
console.log(`- Migrated Asset Directories: ${dirCount}`);

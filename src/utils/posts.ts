import type { CollectionEntry } from 'astro:content';

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatYearMonth(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}.${month}`;
}

export function getPostReadingTime(body: string) {
  // Clean markdown syntax
  const clean = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/#+\s+/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '');
  
  // Count Chinese characters and English words
  const cjkMatches = clean.match(/[\u4e00-\u9fa5]/g) || [];
  const wordsMatches = clean.match(/[a-zA-Z0-9_\-]+/g) || [];
  const totalCount = cjkMatches.length + wordsMatches.length;

  const minutes = Math.max(1, Math.ceil(totalCount / 300));
  return {
    words: totalCount,
    minutes,
  };
}

export function sortPostsByDate(posts: CollectionEntry<'blog'>[]) {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

export function getAllTags(posts: CollectionEntry<'blog'>[]) {
  const tagCountMap: Record<string, number> = {};
  for (const post of posts) {
    if (post.data.draft) continue;
    for (const tag of post.data.tags) {
      tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
    }
  }
  return Object.entries(tagCountMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(posts: CollectionEntry<'blog'>[]) {
  const catCountMap: Record<string, number> = {};
  for (const post of posts) {
    if (post.data.draft) continue;
    for (const cat of post.data.categories) {
      catCountMap[cat] = (catCountMap[cat] || 0) + 1;
    }
  }
  return Object.entries(catCountMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

// Pastel Morandi Color System for Categories
export function getCategoryBadgeStyle(category: string) {
  if (category.includes('前端') || category.includes('Web')) {
    return {
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200/80 dark:border-sky-800/50',
      dot: 'bg-sky-500',
    };
  }
  if (category.includes('技巧') || category.includes('软件') || category.includes('工具')) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200/80 dark:border-emerald-800/50',
      dot: 'bg-emerald-500',
    };
  }
  if (category.includes('分享') || category.includes('思考') || category.includes('折腾')) {
    return {
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200/80 dark:border-indigo-800/50',
      dot: 'bg-indigo-500',
    };
  }
  return {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200/80 dark:border-amber-800/50',
    dot: 'bg-amber-500',
  };
}

// Pastel Color System for Tags
const TAG_PALETTE = [
  { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-300', border: 'border-indigo-200/70 dark:border-indigo-800/50', hover: 'hover:border-indigo-400' },
  { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200/70 dark:border-teal-800/50', hover: 'hover:border-teal-400' },
  { bg: 'bg-sky-50 dark:bg-sky-950/30', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200/70 dark:border-sky-800/50', hover: 'hover:border-sky-400' },
  { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200/70 dark:border-amber-800/50', hover: 'hover:border-amber-400' },
  { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200/70 dark:border-purple-800/50', hover: 'hover:border-purple-400' },
  { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200/70 dark:border-rose-800/50', hover: 'hover:border-rose-400' },
];

export function getTagBadgeStyle(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % TAG_PALETTE.length;
  return TAG_PALETTE[index];
}

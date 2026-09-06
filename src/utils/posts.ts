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

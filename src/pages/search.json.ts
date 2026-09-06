import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { formatDate, sortPostsByDate } from '../utils/posts';

export const GET: APIRoute = async () => {
  const allPosts = await getCollection('blog');
  const sorted = sortPostsByDate(allPosts);

  const searchIndex = sorted.map((post) => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    date: formatDate(post.data.date),
    tags: post.data.tags,
    categories: post.data.categories,
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

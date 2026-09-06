import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortPostsByDate } from '../utils/posts';

export async function GET(context: any) {
  const posts = await getCollection('blog');
  const sorted = sortPostsByDate(posts);

  return rss({
    title: "cuicui'Blog",
    description: '弱小和无知从不是生存的障碍，傲慢才是',
    site: context.site || 'https://cuijunyu.win',
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}

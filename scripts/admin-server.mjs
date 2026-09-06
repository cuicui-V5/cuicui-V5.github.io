import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec, spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const POSTS_DIR = path.join(PROJECT_ROOT, 'src/content/blog');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public/images/posts');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const ADMIN_DIR = path.join(__dirname, 'admin');
const ADMIN_HTML = path.join(ADMIN_DIR, 'index.html');

const PORT = process.env.PORT || 3456;

// Ensure directories exist
fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.mkdirSync(IMAGES_DIR, { recursive: true });
fs.mkdirSync(ADMIN_DIR, { recursive: true });

// --- Helper Functions ---

function parseFrontmatter(rawContent) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      data: {
        title: '未命名文章',
        date: new Date().toISOString(),
        description: '',
        categories: [],
        tags: [],
        draft: false,
      },
      body: rawContent,
    };
  }

  const [, rawFm, body] = match;
  const data = {
    title: '',
    date: new Date().toISOString(),
    description: '',
    categories: [],
    tags: [],
    draft: false,
  };

  const lines = rawFm.split(/\r?\n/);
  let currentArrayKey = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('title:')) {
      data.title = trimmed.replace(/^title:\s*/, '').replace(/^['"](.*)['"]$/, '$1').trim();
      currentArrayKey = null;
    } else if (trimmed.startsWith('date:')) {
      data.date = trimmed.replace(/^date:\s*/, '').replace(/^['"](.*)['"]$/, '$1').trim();
      currentArrayKey = null;
    } else if (trimmed.startsWith('description:')) {
      data.description = trimmed.replace(/^description:\s*/, '').replace(/^['"](.*)['"]$/, '$1').trim();
      currentArrayKey = null;
    } else if (trimmed.startsWith('draft:')) {
      data.draft = trimmed.replace(/^draft:\s*/, '').toLowerCase() === 'true';
      currentArrayKey = null;
    } else if (trimmed === 'categories:') {
      currentArrayKey = 'categories';
    } else if (trimmed === 'tags:') {
      currentArrayKey = 'tags';
    } else if (trimmed.startsWith('- ') && currentArrayKey) {
      const val = trimmed.replace(/^-\s*/, '').replace(/^['"](.*)['"]$/, '$1').trim();
      if (currentArrayKey === 'categories') data.categories.push(val);
      if (currentArrayKey === 'tags') data.tags.push(val);
    } else if (trimmed.includes(':') && !trimmed.startsWith('-')) {
      currentArrayKey = null;
    }
  }

  return { data, body };
}

function serializePost(data, body) {
  const lines = [
    '---',
    `title: ${JSON.stringify(data.title || '无标题')}`,
    `date: ${JSON.stringify(data.date || new Date().toISOString())}`,
    `description: ${JSON.stringify(data.description || '')}`,
  ];

  if (Array.isArray(data.categories) && data.categories.length > 0) {
    lines.push('categories:');
    for (const cat of data.categories) {
      lines.push(`  - ${JSON.stringify(cat)}`);
    }
  }

  if (Array.isArray(data.tags) && data.tags.length > 0) {
    lines.push('tags:');
    for (const tag of data.tags) {
      lines.push(`  - ${JSON.stringify(tag)}`);
    }
  }

  lines.push(`draft: ${Boolean(data.draft)}`);
  lines.push('---', '');

  return lines.join('\n') + (body || '');
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    req.setEncoding('utf-8');
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 50 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

function sanitizeSlug(str) {
  return str
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// --- Request Handler ---

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // CORS Headers
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  try {
    // 1. Static: Admin UI
    if (pathname === '/' || pathname === '/index.html') {
      if (!fs.existsSync(ADMIN_HTML)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Admin HTML not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(ADMIN_HTML).pipe(res);
      return;
    }

    // 2. Static: Image Preview from public/
    if (pathname.startsWith('/images/posts/')) {
      const relPath = pathname.replace(/^\/images\/posts\//, '');
      const filePath = path.join(IMAGES_DIR, relPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeMap = {
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.webp': 'image/webp',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
        };
        res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }

    if (pathname === '/avatar.jpg' || pathname === '/avatar.png') {
      const filePath = path.join(PUBLIC_DIR, path.basename(pathname));
      if (fs.existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': pathname.endsWith('.png') ? 'image/png' : 'image/jpeg' });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }

    // 3. API: GET /api/posts (List all posts)
    if (req.method === 'GET' && pathname === '/api/posts') {
      const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
      const posts = [];

      for (const file of files) {
        const filePath = path.join(POSTS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data, body } = parseFrontmatter(content);
        const slug = file.replace(/\.md$/, '');
        posts.push({
          slug,
          filename: file,
          title: data.title || slug,
          date: data.date,
          description: data.description,
          categories: data.categories || [],
          tags: data.tags || [],
          draft: Boolean(data.draft),
          words: body.length,
        });
      }

      // Sort by date descending
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      sendJson(res, 200, posts);
      return;
    }

    // 4. API: GET /api/posts/:slug (Get single post content)
    if (req.method === 'GET' && pathname.startsWith('/api/posts/')) {
      const slug = pathname.replace(/^\/api\/posts\//, '');
      const filePath = path.join(POSTS_DIR, `${slug}.md`);

      if (!fs.existsSync(filePath)) {
        sendJson(res, 404, { error: '文章不存在' });
        return;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, body } = parseFrontmatter(content);
      sendJson(res, 200, {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        categories: data.categories,
        tags: data.tags,
        draft: data.draft,
        body,
      });
      return;
    }

    // 5. API: POST /api/posts (Create new post)
    if (req.method === 'POST' && pathname === '/api/posts') {
      const body = await parseJsonBody(req);
      const title = body.title?.trim() || '新文章';
      const now = new Date();
      const datePrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      let slug = body.slug ? sanitizeSlug(body.slug) : `${datePrefix}-${sanitizeSlug(title)}`;
      if (!slug) slug = `${datePrefix}-untitled`;

      const filePath = path.join(POSTS_DIR, `${slug}.md`);
      if (fs.existsSync(filePath)) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const postData = {
        title,
        date: body.date || now.toISOString().replace('T', ' ').slice(0, 19),
        description: body.description || '',
        categories: Array.isArray(body.categories) ? body.categories : body.categories ? [body.categories] : ['思考随笔'],
        tags: Array.isArray(body.tags) ? body.tags : body.tags ? [body.tags] : ['随笔'],
        draft: Boolean(body.draft),
      };

      const markdownContent = serializePost(postData, body.body || '\n在此输入正文内容...\n');
      fs.writeFileSync(path.join(POSTS_DIR, `${slug}.md`), markdownContent, 'utf-8');

      // Create image folder for this post
      fs.mkdirSync(path.join(IMAGES_DIR, slug), { recursive: true });

      sendJson(res, 201, { success: true, slug });
      return;
    }

    // 6. API: PUT /api/posts/:slug (Update post)
    if (req.method === 'PUT' && pathname.startsWith('/api/posts/')) {
      const slug = pathname.replace(/^\/api\/posts\//, '');
      const oldFilePath = path.join(POSTS_DIR, `${slug}.md`);

      if (!fs.existsSync(oldFilePath)) {
        sendJson(res, 404, { error: '要更新的文章不存在' });
        return;
      }

      const body = await parseJsonBody(req);
      const postData = {
        title: body.title,
        date: body.date,
        description: body.description,
        categories: body.categories,
        tags: body.tags,
        draft: Boolean(body.draft),
      };

      const markdownContent = serializePost(postData, body.body);

      // Check if renaming slug
      const newSlug = body.newSlug ? sanitizeSlug(body.newSlug) : slug;
      if (newSlug !== slug) {
        const newFilePath = path.join(POSTS_DIR, `${newSlug}.md`);
        fs.writeFileSync(newFilePath, markdownContent, 'utf-8');
        fs.unlinkSync(oldFilePath);

        // Rename image folder if exists
        const oldImgDir = path.join(IMAGES_DIR, slug);
        const newImgDir = path.join(IMAGES_DIR, newSlug);
        if (fs.existsSync(oldImgDir) && !fs.existsSync(newImgDir)) {
          fs.renameSync(oldImgDir, newImgDir);
        }
        sendJson(res, 200, { success: true, slug: newSlug });
      } else {
        fs.writeFileSync(oldFilePath, markdownContent, 'utf-8');
        sendJson(res, 200, { success: true, slug });
      }
      return;
    }

    // 7. API: DELETE /api/posts/:slug (Delete post)
    if (req.method === 'DELETE' && pathname.startsWith('/api/posts/')) {
      const slug = pathname.replace(/^\/api\/posts\//, '');
      const filePath = path.join(POSTS_DIR, `${slug}.md`);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Optionally clean image directory
      const imgDir = path.join(IMAGES_DIR, slug);
      if (fs.existsSync(imgDir)) {
        fs.rmSync(imgDir, { recursive: true, force: true });
      }

      sendJson(res, 200, { success: true });
      return;
    }

    // 8. API: POST /api/upload-image (Upload pasted screenshot)
    if (req.method === 'POST' && pathname === '/api/upload-image') {
      const data = await parseJsonBody(req);
      let { slug, base64, filename } = data;

      if (!slug || !base64) {
        sendJson(res, 400, { error: '缺少 slug 或 base64 数据' });
        return;
      }

      slug = sanitizeSlug(slug);
      // Ensure post image directory exists
      const targetDir = path.join(IMAGES_DIR, slug);
      fs.mkdirSync(targetDir, { recursive: true });

      // Determine extension and clean base64 data
      let ext = 'png';
      let cleanBase64 = base64;
      const match = base64.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        ext = match[1] === 'jpeg' ? 'jpg' : match[1];
        cleanBase64 = match[2];
      }

      const now = new Date();
      const timeStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
      const actualFilename = filename ? filename.replace(/[\\/:*?"<>|]/g, '_') : `paste_${timeStr}.${ext}`;

      const buffer = Buffer.from(cleanBase64, 'base64');
      const targetFilePath = path.join(targetDir, actualFilename);
      fs.writeFileSync(targetFilePath, buffer);

      const webPath = `/images/posts/${slug}/${actualFilename}`;
      sendJson(res, 200, {
        success: true,
        url: webPath,
        filename: actualFilename,
      });
      return;
    }

    // 9. API: POST /api/deploy (One-click build and push)
    if (req.method === 'POST' && pathname === '/api/deploy') {
      const data = await parseJsonBody(req);
      const commitMsg = data.message?.trim() || 'feat(content): update blog posts via admin studio';

      const commands = [
        'npm run check',
        'npm run build',
        'git add .',
        `git commit -m "${commitMsg.replace(/"/g, '\\"')}"`,
        'git push origin main',
        'git push origin main:master',
      ];

      // Execute commands sequentially
      let fullOutput = '';
      let hasError = false;

      exec(commands.join(' && '), { cwd: PROJECT_ROOT }, (error, stdout, stderr) => {
        fullOutput = stdout + '\n' + (stderr || '');
        if (error) {
          // If commit had nothing to commit, continue with push
          if (fullOutput.includes('nothing to commit')) {
            exec('git push origin main && git push origin main:master', { cwd: PROJECT_ROOT }, (pErr, pOut, pErrOut) => {
              sendJson(res, 200, {
                success: !pErr,
                output: fullOutput + '\n' + pOut + '\n' + (pErrOut || ''),
              });
            });
            return;
          }
          sendJson(res, 500, {
            success: false,
            error: error.message,
            output: fullOutput,
          });
        } else {
          sendJson(res, 200, {
            success: true,
            output: fullOutput,
          });
        }
      });
      return;
    }

    // 404 for unknown endpoints
    sendJson(res, 404, { error: 'Endpoint not found' });
  } catch (err) {
    console.error('Server error:', err);
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n==============================================`);
  console.log(`🚀 cuicui'Blog Admin Studio is running!`);
  console.log(`👉 Access URL: ${url}`);
  console.log(`==============================================\n`);

  // Open browser on Windows automatically
  if (process.platform === 'win32') {
    exec(`start ${url}`);
  }
});

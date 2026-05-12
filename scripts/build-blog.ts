import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/data/blogPosts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

async function run() {
  console.log('🚀 Starting Manual HTML Injection for Blog Posts...');
  
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('❌ Error: dist/index.html not found. Build the app first.');
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  for (const post of blogPosts) {
    const postDir = path.join(DIST_DIR, 'blog', post.slug);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    // Prepare the raw content to be "baked in"
    const bakedContent = `
      <div id="seo-content" style="display:none;">
        <h1>${post.title}</h1>
        <p>By ${post.author} on ${post.date}</p>
        <div>${post.excerpt}</div>
        <article>
          ${post.content.split('\n').map(line => `<p>${line.trim()}</p>`).filter(p => p !== '<p></p>').join('')}
        </article>
      </div>
    `;

    let html = template;

    // 1. Force the Title
    html = html.replace(/<title>.*?<\/title>/, `<title>${post.title} | The Halftimer</title>`);

    // 2. Force the Description
    const desc = post.excerpt.substring(0, 160).replace(/"/g, '&quot;');
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`);

    // 3. Inject the physical text into the body (after root)
    html = html.replace('<div id="root"></div>', `<div id="root"></div>${bakedContent}`);

    // 4. Set Canonical
    const canonical = `<link rel="canonical" href="https://thehalftimer.com/blog/${post.slug}" />`;
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href=".*?" \/>/, canonical);
    } else {
      html = html.replace('</head>', `  ${canonical}\n</head>`);
    }

    fs.writeFileSync(path.join(postDir, 'index.html'), html);
    console.log(`✅ Baked: /blog/${post.slug}/index.html`);
  }

  console.log('✨ Manual Injection Complete.');
}

run().catch(console.error);
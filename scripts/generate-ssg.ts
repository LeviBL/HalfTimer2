import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/data/blogPosts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

async function generate() {
  console.log('--- Starting SSG Generation for Blog Routes ---');
  
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error('Error: dist/index.html not found. Please run "npm run build" first.');
    process.exit(1);
  }

  const template = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  for (const post of blogPosts) {
    const postDir = path.join(DIST_DIR, 'blog', post.slug);
    
    // Create directory for the post (e.g., dist/blog/my-post-slug/)
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    const description = post.excerpt.substring(0, 160).replace(/"/g, '&quot;');
    
    // Prepare the noscript content with the full article text
    const noscriptContent = `
    <noscript>
      <article>
        <h1>${post.title}</h1>
        <p><strong>Author:</strong> ${post.author}</p>
        <p><strong>Date:</strong> ${post.date}</p>
        <p><strong>Category:</strong> ${post.category}</p>
        <div class="content">
          ${post.content.split('\n').map(p => `<p>${p.trim()}</p>`).filter(p => p !== '<p></p>').join('')}
        </div>
      </article>
    </noscript>
    `;

    let html = template;

    // Replace Title - using a more robust regex
    html = html.replace(/<title>.*?<\/title>/, `<title>${post.title} | The Halftimer</title>`);

    // Replace Description - using a more robust regex
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`);

    // Inject Noscript content after the root div
    if (html.includes('<div id="root"></div>')) {
      html = html.replace('<div id="root"></div>', `<div id="root"></div>${noscriptContent}`);
    } else {
      console.warn(`Warning: Could not find <div id="root"></div> in template for ${post.slug}`);
    }

    // Handle Canonical URL
    const canonicalUrl = `https://thehalftimer.com/blog/${post.slug}`;
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
    
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link rel="canonical" href=".*?" \/>/, canonicalTag);
    } else {
      html = html.replace('</head>', `  ${canonicalTag}\n  </head>`);
    }

    // Write the final HTML file
    fs.writeFileSync(path.join(postDir, 'index.html'), html);
    console.log(`✓ Generated: /blog/${post.slug}/index.html`);
  }

  console.log('--- SSG Generation Complete ---');
}

generate().catch(err => {
  console.error('SSG Generation failed:', err);
  process.exit(1);
});
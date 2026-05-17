import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from '../src/data/blogPosts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

async function run() {
  console.log('🚀 Starting Content Injection for SEO...');
  
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error('❌ Error: dist/index.html not found. Build the app first.');
    process.exit(1);
  }

  let html = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

  // Generate a massive <noscript> block containing all blog content
  const seoContent = `
    <noscript>
      <div id="seo-blog-content">
        ${blogPosts.map(post => `
          <article>
            <h2>${post.title}</h2>
            <p>By ${post.author} on ${post.date}</p>
            <p>${post.excerpt}</p>
            <div>${post.content.split('\n').map(line => `<p>${line.trim()}</p>`).filter(p => p !== '<p></p>').join('')}</div>
          </article>
          <hr />
        `).join('')}
      </div>
    </noscript>
  `;

  // Inject the content into the placeholder - using a regex to match the div even with styles/attributes
  const placeholderRegex = /<div id="seo-content-placeholder"[^>]*><\/div>/;
  
  if (placeholderRegex.test(html)) {
    html = html.replace(placeholderRegex, seoContent);
    console.log('✅ Successfully injected blog content into index.html');
  } else {
    console.warn('⚠️ Warning: Could not find seo-content-placeholder in index.html');
  }

  fs.writeFileSync(INDEX_HTML_PATH, html);
  console.log('✨ SEO Content Injection Complete.');
}

run().catch(console.error);
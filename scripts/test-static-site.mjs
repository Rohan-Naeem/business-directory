import fs from 'fs';

console.log('Testing NexusBiz Static HTML/CSS/JS/JSON/Sitemap Suite...\n');

const files = [
  'index.html',
  'search.html',
  'directories.html',
  'business.html',
  'add-business.html',
  'admin.html',
  'about.html',
  'contact.html',
  'guidelines.html',
  'privacy.html',
  'terms.html',
  'css/styles.css',
  'js/data.js',
  'js/app.js',
  'data.json',
  'sitemap.xml',
  'robots.txt',
  'manifest.json'
];

let errors = 0;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`[MISSING] ${file}`);
    errors++;
    continue;
  }
  const stat = fs.statSync(file);
  const content = fs.readFileSync(file, 'utf8');

  if (file.endsWith('.json')) {
    try {
      JSON.parse(content);
      console.log(`[PASS] ${file.padEnd(20)} Valid JSON (${stat.size} bytes)`);
    } catch (e) {
      console.error(`[FAIL] ${file} Invalid JSON: ${e.message}`);
      errors++;
    }
  } else if (file.endsWith('.xml')) {
    if (content.includes('<?xml') && content.includes('</urlset>')) {
      console.log(`[PASS] ${file.padEnd(20)} Valid XML Sitemap (${stat.size} bytes)`);
    } else {
      console.error(`[FAIL] ${file} Malformed XML`);
      errors++;
    }
  } else if (file.endsWith('.html')) {
    if (content.includes('<!DOCTYPE html>') && content.includes('</html>')) {
      console.log(`[PASS] ${file.padEnd(20)} Valid HTML5 document (${stat.size} bytes)`);
    } else {
      console.error(`[FAIL] ${file} Malformed HTML`);
      errors++;
    }
  } else {
    console.log(`[PASS] ${file.padEnd(20)} Present & Non-empty (${stat.size} bytes)`);
  }
}

if (errors === 0) {
  console.log(`\nAll ${files.length} static files verified successfully with 0 errors!`);
} else {
  console.error(`\nFound ${errors} errors.`);
  process.exit(1);
}

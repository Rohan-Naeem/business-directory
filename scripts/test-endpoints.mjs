async function testEndpoints() {
  const endpoints = [
    '/',
    '/sitemap.xml',
    '/robots.txt',
    '/search?q=hospital',
    '/directories',
    '/directories/pakistan',
    '/directories/pakistan/lahore',
    '/business/systems-limited-lahore',
    '/categories',
    '/categories/it-software',
    '/add-business',
    '/admin',
    '/admin/listings',
    '/admin/locations',
    '/admin/reviews',
    '/admin/reports',
    '/api/businesses'
  ];

  console.log('Testing Global Bizz Hub Endpoints on http://localhost:3000...\n');
  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    try {
      const res = await fetch(`http://localhost:3000${ep}`);
      const text = await res.text();
      if (res.status >= 200 && res.status < 400) {
        console.log(`[PASS] ${ep.padEnd(35)} Status: ${res.status} | Size: ${text.length} bytes`);
        passed++;
      } else {
        console.error(`[FAIL] ${ep.padEnd(35)} Status: ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${ep.padEnd(35)} ${err.message}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${endpoints.length} endpoints tested.`);
}

testEndpoints();

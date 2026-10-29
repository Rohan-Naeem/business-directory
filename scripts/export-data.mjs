import fs from 'fs';
import path from 'path';

async function exportStaticData() {
  console.log('Fetching live directory data from http://localhost:3000...');
  
  // We can fetch businesses from http://localhost:3000/api/businesses
  const res = await fetch('http://localhost:3000/api/businesses?limit=100');
  const data = await res.json();
  const businesses = data.businesses || [];

  // Also read the categories, countries, regions, cities from the repository
  // Let's create an API route or fetch all entities
  console.log(`Retrieved ${businesses.length} businesses from server.`);

  // Let's dump the data
  const dump = {
    generated_at: new Date().toISOString(),
    total_businesses: businesses.length,
    businesses: businesses
  };

  fs.writeFileSync('public/data-sample.json', JSON.stringify(dump, null, 2));
  console.log('Saved to public/data-sample.json');
}

exportStaticData().catch(console.error);

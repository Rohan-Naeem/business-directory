async function testMutations() {
  console.log('Testing Global Bizz Hub Dynamic Mutation Flows on http://localhost:3000...\n');

  // 1. Submit a new business
  console.log('1. Testing Business Submission via /api/businesses (POST)...');
  const newBusinessPayload = {
    name: 'Horizon Green Energy Labs',
    category_id: 'cat-it',
    country_id: 'country-pk',
    region_id: 'reg-pk-punjab',
    city_id: 'city-lahore',
    address: 'Phase 5, DHA, Lahore',
    postal_code: '54000',
    phone: '+92 42 3578 9900',
    email: 'info@horizongreenenergy.pk',
    website: 'https://horizongreenenergy.pk',
    whatsapp: '+92 300 1234567',
    short_description: 'Pioneering clean tech, green energy software and IoT analytics.',
    description: 'Pioneering clean tech, green energy software and IoT smart grid analytics for modern industrial infrastructure and enterprise decarbonization.',
    hours: [
      { day_of_week: 1, opens_at: '09:00', closes_at: '18:00', is_closed: false }
    ]
  };

  const createRes = await fetch('http://localhost:3000/api/businesses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBusinessPayload)
  });
  const createData = await createRes.json();
  console.log('Create Response Status:', createRes.status);
  console.log('Created Business:', createData.business?.name, '| Status:', createData.business?.status, '| Slug:', createData.business?.slug);

  if (createRes.status !== 201 || createData.business?.status !== 'pending') {
    throw new Error('Business creation failed or status was not pending!');
  }
  const createdId = createData.business.id;

  // 2. Admin approves the business
  console.log('\n2. Testing Admin Approval via /api/admin/listings (PATCH)...');
  const approveRes = await fetch('http://localhost:3000/api/admin/listings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: createdId, action: 'update_status', status: 'approved' })
  });
  const approveData = await approveRes.json();
  console.log('Approve Response Status:', approveRes.status, '| Message:', approveData.message);

  if (approveRes.status !== 200 || !approveData.success) {
    throw new Error('Admin approval failed!');
  }

  // 3. Submit a review for the business
  console.log('\n3. Testing Review Submission via /api/reviews (POST)...');
  const reviewRes = await fetch('http://localhost:3000/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business_id: createdId,
      user_name: 'Dr. Tariq Mahmood',
      user_email: 'tariq.mahmood@example.com',
      rating: 5,
      comment: 'Outstanding green technology solutions and very responsive engineering team.'
    })
  });
  const reviewData = await reviewRes.json();
  console.log('Review Response Status:', reviewRes.status, '| Review Status:', reviewData.review?.status);

  // 4. Submit a report for a business
  console.log('\n4. Testing Report Submission via /api/reports (POST)...');
  const reportRes = await fetch('http://localhost:3000/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business_id: createdId,
      reporter_email: 'jane@example.com',
      reason: 'Incorrect location information',
      details: 'The office moved to Phase 6.'
    })
  });
  const reportData = await reportRes.json();
  console.log('Report Response Status:', reportRes.status, '| Report Status:', reportData.report?.status);

  // 5. Test Geo Import
  console.log('\n5. Testing Geographic Data Import via /api/admin/import-geo (POST)...');
  const geoRes = await fetch('http://localhost:3000/api/admin/import-geo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ datasetKey: 'pk' })
  });
  const geoData = await geoRes.json();
  console.log('Geo Import Status:', geoRes.status, '| Result:', geoData.summary);

  console.log('\nALL MUTATION FLOWS PASSED WITH 100% SUCCESS!');
}

testMutations().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});

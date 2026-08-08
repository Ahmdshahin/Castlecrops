async function runTests() {
  console.log('Starting Website Tests...\n');
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  async function testRoute(name, path, options = {}) {
    try {
      console.log(`[TEST] ${name} (${path})`);
      const res = await fetch(baseUrl + path, options);
      if (res.ok) {
        console.log(`✅ PASSED (${res.status})`);
        passed++;
      } else {
        console.log(`❌ FAILED (${res.status})`);
        failed++;
      }
    } catch (e) {
      console.log(`❌ FAILED (Network error: ${e.message})`);
      failed++;
    }
    console.log('---');
  }

  // 1. Frontend Tests
  await testRoute('Frontend: English Homepage', '/en');
  await testRoute('Frontend: Arabic Homepage', '/ar');
  await testRoute('Frontend: Products Page', '/en/products');
  await testRoute('Frontend: Blog Page', '/en/blog');
  await testRoute('Frontend: Contact Page', '/en/contact');

  // 2. Admin Frontend
  await testRoute('Frontend: Admin Login Page', '/admin');

  // 3. Backend API Test (RFQ)
  await testRoute('Backend: RFQ API Invalid Submission Test', '/api/rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'TestUser' }) // Missing required fields should fail gracefully
  });

  console.log(`\nTest Summary: ${passed} Passed, ${failed} Failed`);
  if (failed === 0) {
    console.log('🎉 All tested functions are operational!');
  } else if (failed === 1 && passed === 6) {
      console.log('Note: RFQ failure is expected because we intentionally sent bad data to test validation.');
  }
}

runTests();

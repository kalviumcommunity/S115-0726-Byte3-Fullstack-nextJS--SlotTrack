// @ts-nocheck
import { chromium } from 'playwright';

async function profileUserFlows() {
  console.log('🚀 Starting E2E Profiling Investigation...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const timings: Record<string, any> = {};

  // Helper to record network request timelines
  const requestLogs: Array<{ url: string; method: string; status: number; ttfb: number; duration: number }> = [];

  page.on('requestfinished', async (req) => {
    const response = await req.response();
    const timing = req.timing();
    if (response) {
      requestLogs.push({
        url: req.url(),
        method: req.method(),
        status: response.status(),
        ttfb: timing.responseStart > 0 ? timing.responseStart - timing.requestStart : 0,
        duration: timing.responseEnd > 0 ? timing.responseEnd - timing.requestStart : 0,
      });
    }
  });

  // 1. Profile Member Login
  console.log('\n--- 1. PROFILING MEMBER LOGIN ---');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'aarav.sharma@slottrack.com');
  await page.fill('input[type="password"]', 'Password@123');

  const loginClick = performance.now();
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  const loginEnd = performance.now();

  timings['LOGIN'] = {
    clickToVisibleUpdateMs: +(loginEnd - loginClick).toFixed(2),
  };
  console.log(`Member Login Total Latency: ${timings['LOGIN'].clickToVisibleUpdateMs} ms`);

  // Wait for dashboard to settle
  await page.waitForTimeout(2000);

  // 2. Profile Book Class
  console.log('\n--- 2. PROFILING BOOK CLASS ---');
  // Find an unbooked class card button
  const bookButton = page.locator('button:has-text("Book Slot"), button:has-text("Book Class")').first();
  if (await bookButton.isVisible()) {
    const bookClick = performance.now();
    await bookButton.click();
    // Wait for button state to change to "Booked" or "Cancel"
    await page.waitForSelector('button:has-text("Booked"), button:has-text("Cancel")', { timeout: 15000 });
    const bookEnd = performance.now();
    timings['BOOK_CLASS'] = {
      clickToVisibleUpdateMs: +(bookEnd - bookClick).toFixed(2),
    };
    console.log(`Book Class Total Latency: ${timings['BOOK_CLASS'].clickToVisibleUpdateMs} ms`);
  } else {
    console.log('No unbooked class button found immediately');
  }

  await page.waitForTimeout(2000);

  // 3. Profile Cancel Booking
  console.log('\n--- 3. PROFILING CANCEL BOOKING ---');
  const cancelButton = page.locator('button:has-text("Booked"), button:has-text("Cancel")').first();
  if (await cancelButton.isVisible()) {
    const cancelClick = performance.now();
    await cancelButton.click();
    await page.waitForSelector('button:has-text("Book Slot"), button:has-text("Book Class")', { timeout: 15000 });
    const cancelEnd = performance.now();
    timings['CANCEL_BOOKING'] = {
      clickToVisibleUpdateMs: +(cancelEnd - cancelClick).toFixed(2),
    };
    console.log(`Cancel Booking Total Latency: ${timings['CANCEL_BOOKING'].clickToVisibleUpdateMs} ms`);
  }

  // 4. Profile Signup
  console.log('\n--- 4. PROFILING SIGNUP ---');
  await page.goto('http://localhost:3000/signup');
  const testEmail = `testuser_${Date.now()}@slottrack.com`;
  await page.fill('input[name="name"], input[placeholder*="Name"]', 'Test Performance User');
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', 'Password@123');

  // Select Member role if radio/select exists
  const signupClick = performance.now();
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  const signupEnd = performance.now();

  timings['SIGNUP'] = {
    clickToVisibleUpdateMs: +(signupEnd - signupClick).toFixed(2),
  };
  console.log(`Signup Total Latency: ${timings['SIGNUP'].clickToVisibleUpdateMs} ms`);

  // 5. Profile Admin Flow
  console.log('\n--- 5. PROFILING ADMIN FLOW ---');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin1@slottrack.com');
  await page.fill('input[type="password"]', 'Password@123');

  const adminLoginClick = performance.now();
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  const adminLoginEnd = performance.now();
  timings['ADMIN_LOGIN'] = {
    clickToVisibleUpdateMs: +(adminLoginEnd - adminLoginClick).toFixed(2),
  };

  await page.goto('http://localhost:3000/admin');
  await page.waitForSelector('text=Instructor Dashboard', { timeout: 10000 });

  // Create Class
  console.log('\n--- 6. PROFILING CREATE CLASS ---');
  await page.click('button:has-text("Create New Class")');
  await page.fill('input[name="title"]', `Perf Class ${Date.now()}`);
  await page.fill('textarea[name="description"], input[name="description"]', 'Performance test class description');
  await page.fill('input[name="location"]', 'Pune');
  await page.fill('input[name="capacity"]', '20');
  await page.fill('input[name="price"]', '500');

  const createClick = performance.now();
  await page.click('button[type="submit"]:has-text("Create Class")');
  await page.waitForSelector(`text=Perf Class`, { timeout: 15000 });
  const createEnd = performance.now();

  timings['CREATE_CLASS'] = {
    clickToVisibleUpdateMs: +(createEnd - createClick).toFixed(2),
  };
  console.log(`Create Class Total Latency: ${timings['CREATE_CLASS'].clickToVisibleUpdateMs} ms`);

  console.log('\n=========================================');
  console.log('FINAL E2E TIMINGS SUMMARY (MEASURED):');
  console.table(timings);
  console.log('=========================================');

  await browser.close();
}

profileUserFlows().catch(console.error);

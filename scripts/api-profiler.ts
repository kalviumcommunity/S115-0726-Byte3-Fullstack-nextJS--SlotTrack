import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface ApiTiming {
  endpoint: string;
  method: string;
  statusCode: number;
  totalDurationMs: number;
  dataSize: number;
}

async function runApiProfiling() {
  console.log('=====================================================');
  console.log('Starting Layered API Performance Profiling & Audit...');
  console.log('=====================================================\n');

  const results: ApiTiming[] = [];

  const client = axios.create({
    baseURL: BASE_URL,
    validateStatus: () => true,
  });

  async function measureRequest(method: string, url: string, data?: any, headers?: Record<string, string>): Promise<{ status: number; data: any; duration: number }> {
    const start = performance.now();
    const res = await client.request({
      method,
      url,
      data,
      headers,
    });
    const duration = +(performance.now() - start).toFixed(2);
    const size = JSON.stringify(res.data).length;
    results.push({
      endpoint: url,
      method,
      statusCode: res.status,
      totalDurationMs: duration,
      dataSize: size,
    });
    console.log(`[API MEASURED] ${method} ${url} -> Status: ${res.status} | Total Duration: ${duration} ms | Payload Size: ${size} bytes`);
    return { status: res.status, data: res.data, duration };
  }

  // 1. Member Signup
  console.log('--- 1. SIGNUP ---');
  const signupEmail = `perf_member_${Date.now()}@slottrack.com`;
  const signupRes = await measureRequest('POST', '/api/auth/register', {
    name: 'Perf Member',
    email: signupEmail,
    password: 'Password@123',
    gender: 'Male',
    age: 25,
  });

  // 2. Member Login
  console.log('\n--- 2. MEMBER LOGIN ---');
  const loginRes = await measureRequest('POST', '/api/auth/login', {
    email: 'aarav.sharma@slottrack.com',
    password: 'Password@123',
  });
  const memberUser = loginRes.data?.data;
  const memberHeaders = { 'x-user-id': 'user-member-1', 'x-user-role': 'MEMBER' };

  // 3. Admin Login
  console.log('\n--- 3. ADMIN LOGIN ---');
  const adminLoginRes = await measureRequest('POST', '/api/auth/login', {
    email: 'admin1@slottrack.com',
    password: 'Password@123',
  });
  const adminHeaders = { 'x-user-id': 'user-admin-1', 'x-user-role': 'ADMIN' };

  // 4. Get Profile
  console.log('\n--- 4. GET PROFILE ---');
  await measureRequest('GET', '/api/auth/profile', undefined, memberHeaders);

  // 5. Get Classes (All & Pune)
  console.log('\n--- 5. GET CLASSES ---');
  const classesRes = await measureRequest('GET', '/api/classes?location=Pune', undefined, memberHeaders);
  const classes = classesRes.data?.data || [];
  const testClass = classes.find((c: any) => c.availableSeats > 0) || classes[0];

  // 6. Book Class
  console.log('\n--- 6. BOOK CLASS ---');
  let bookingId = '';
  if (testClass) {
    const bookRes = await measureRequest('POST', '/api/bookings', { classId: testClass.id }, memberHeaders);
    bookingId = bookRes.data?.data?.booking?.id || `bk-${testClass.id}-user-member-1`;
  }

  // 7. Get Active Bookings
  console.log('\n--- 7. GET ACTIVE BOOKINGS ---');
  await measureRequest('GET', '/api/bookings', undefined, memberHeaders);

  // 8. Get Booking History
  console.log('\n--- 8. GET BOOKING HISTORY ---');
  await measureRequest('GET', '/api/bookings/history?page=1&limit=20', undefined, memberHeaders);

  // 9. Cancel Booking
  console.log('\n--- 9. CANCEL BOOKING ---');
  if (testClass) {
    await measureRequest('POST', `/api/bookings/${testClass.id}/cancel`, undefined, memberHeaders);
  }

  // 10. Admin Create Class
  console.log('\n--- 10. ADMIN CREATE CLASS ---');
  const newClassRes = await measureRequest('POST', '/api/classes', {
    title: `Bench Class ${Date.now()}`,
    description: 'Performance Benchmark Class',
    instructor: 'Admin User 1',
    category: 'HIIT',
    location: 'Pune',
    detailedLocation: 'Baner Studio, Pune',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 90000000).toISOString(),
    capacity: 20,
    price: 799,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  }, adminHeaders);
  const createdClassId = newClassRes.data?.data?.id;

  // 11. Admin Edit Class
  console.log('\n--- 11. ADMIN EDIT CLASS ---');
  if (createdClassId) {
    await measureRequest('PUT', `/api/classes/${createdClassId}`, {
      title: `Updated Bench Class ${Date.now()}`,
      capacity: 25,
      price: 899,
    }, adminHeaders);
  }

  // 12. Admin Delete Class
  console.log('\n--- 12. ADMIN DELETE CLASS ---');
  if (createdClassId) {
    await measureRequest('DELETE', `/api/classes/${createdClassId}`, undefined, adminHeaders);
  }

  // 13. Simulate Waterfall Sequence (What frontend does on Booking Click)
  console.log('\n--- 13. SIMULATING FRONTEND BOOKING WATERFALL ---');
  const waterfallStart = performance.now();
  console.log('Step 1: POST /api/bookings');
  await measureRequest('POST', '/api/bookings', { classId: testClass.id }, memberHeaders);
  console.log('Step 2: GET /api/auth/profile');
  await measureRequest('GET', '/api/auth/profile', undefined, memberHeaders);
  console.log('Step 3: GET /api/bookings');
  await measureRequest('GET', '/api/bookings', undefined, memberHeaders);
  console.log('Step 4: GET /api/bookings/history');
  await measureRequest('GET', '/api/bookings/history?page=1&limit=20', undefined, memberHeaders);
  console.log('Step 5: GET /api/classes?location=Pune (triggered by bookedClassIds state update)');
  await measureRequest('GET', '/api/classes?location=Pune', undefined, memberHeaders);

  const totalWaterfallTime = +(performance.now() - waterfallStart).toFixed(2);
  console.log(`\n=====================================================`);
  console.log(`FRONTEND BOOKING WATERFALL TOTAL DURATION: ${totalWaterfallTime} ms`);
  console.log(`=====================================================\n`);

  console.table(results);
}

runApiProfiling().catch(console.error);

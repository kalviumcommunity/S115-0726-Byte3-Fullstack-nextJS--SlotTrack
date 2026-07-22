import { PrismaClient, Role, BookingStatus } from '../app/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// Set up the Prisma Client with PG Driver Adapter
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is missing.');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper to create dates relative to the current date for testing
function getRelativeDate(daysOffset: number, hours: number, minutes: number = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function getEndDate(startDate: Date, durationMinutes: number): Date {
  const date = new Date(startDate);
  date.setMinutes(date.getMinutes() + durationMinutes);
  return date;
}

async function seedUsers(hashedPassword: string) {
  console.log('Seeding users...');

  const usersToSeed = [
    // 2 Admin Users
    {
      id: 'user-admin-1',
      email: 'admin1@slottrack.com',
      name: 'Admin User 1',
      role: Role.ADMIN,
      employeeId: 'EMP-001',
      gender: 'Male',
      age: 32,
    },
    {
      id: 'user-admin-2',
      email: 'admin2@slottrack.com',
      name: 'Admin User 2',
      role: Role.ADMIN,
      employeeId: 'EMP-002',
      gender: 'Female',
      age: 29,
    },
    // 6 Member Users
    {
      id: 'user-member-1',
      email: 'aarav.sharma@slottrack.com',
      name: 'Aarav Sharma',
      role: Role.MEMBER,
      gender: 'Male',
      age: 26,
    },
    {
      id: 'user-member-2',
      email: 'priya.patel@slottrack.com',
      name: 'Priya Patel',
      role: Role.MEMBER,
      gender: 'Female',
      age: 24,
    },
    {
      id: 'user-member-3',
      email: 'rahul.verma@slottrack.com',
      name: 'Rahul Verma',
      role: Role.MEMBER,
      gender: 'Male',
      age: 30,
    },
    {
      id: 'user-member-4',
      email: 'neha.gupta@slottrack.com',
      name: 'Neha Gupta',
      role: Role.MEMBER,
      gender: 'Female',
      age: 27,
    },
    {
      id: 'user-member-5',
      email: 'rohan.singh@slottrack.com',
      name: 'Rohan Singh',
      role: Role.MEMBER,
      gender: 'Male',
      age: 28,
    },
    {
      id: 'user-member-6',
      email: 'sneha.joshi@slottrack.com',
      name: 'Sneha Joshi',
      role: Role.MEMBER,
      gender: 'Female',
      age: 25,
    },
  ];

  const upsertedUsers = [];
  for (const user of usersToSeed) {
    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
        employeeId: user.employeeId || null,
        gender: user.gender || null,
        age: user.age || null,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
        employeeId: user.employeeId || null,
        gender: user.gender || null,
        age: user.age || null,
      },
    });
    upsertedUsers.push(upserted);
  }

  console.log(`Successfully seeded ${upsertedUsers.length} users (2 Admins, 6 Members).`);
  return upsertedUsers;
}

async function seedPastClasses() {
  console.log('Seeding past fitness classes (historical data)...');

  const pastClassesToSeed = [
    {
      id: 'class-past-1',
      title: 'Sunrise Vinyasa Yoga',
      description: 'Energizing morning vinyasa flow focusing on core alignment and deep breathing.',
      instructor: 'Vikram Malhotra',
      category: 'Yoga',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      location: 'Bandra Hub, Mumbai',
      price: 599,
      capacity: 20,
      daysOffset: -5,
      startHour: 7,
      durationMinutes: 60,
    },
    {
      id: 'class-past-2',
      title: 'Metabolic HIIT Burn',
      description: 'High-intensity interval training session designed for fat burn and stamina.',
      instructor: 'Priya Sharma',
      category: 'HIIT',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Baner Studio, Pune',
      price: 799,
      capacity: 25,
      daysOffset: -5,
      startHour: 17,
      durationMinutes: 45,
    },
    {
      id: 'class-past-3',
      title: 'Barbell Strength & Form',
      description: 'Technique-driven barbell lifting session focusing on squats and deadlifts.',
      instructor: 'Arjun Kapoor',
      category: 'Strength',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Koramangala Studio, Bangalore',
      price: 899,
      capacity: 20,
      daysOffset: -4,
      startHour: 9,
      durationMinutes: 60,
    },
    {
      id: 'class-past-4',
      title: 'Core Mat Pilates',
      description: 'Low-impact core strengthening and posture realignment Pilates class.',
      instructor: 'Neha Gupta',
      category: 'Pilates',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      location: 'Connaught Place, Delhi',
      price: 699,
      capacity: 18,
      daysOffset: -4,
      startHour: 19,
      durationMinutes: 60,
    },
    {
      id: 'class-past-5',
      title: 'Bollywood Dance Fitness',
      description: 'Fun cardio dance workout set to high-energy Bollywood tracks.',
      instructor: 'Rajesh Varma',
      category: 'Dance Fitness',
      imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=800&auto=format&fit=crop',
      location: 'Jubilee Hills, Hyderabad',
      price: 699,
      capacity: 30,
      daysOffset: -3,
      startHour: 11,
      durationMinutes: 60,
    },
    {
      id: 'class-past-6',
      title: 'Cardio Endurance Spin',
      description: 'Cadence and hill-climb cycling workout for cardiovascular fitness.',
      instructor: 'Divya Nair',
      category: 'Cycling',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Andheri Fitness Center, Mumbai',
      price: 799,
      capacity: 20,
      daysOffset: -3,
      startHour: 17,
      durationMinutes: 45,
    },
    {
      id: 'class-past-7',
      title: 'CrossFit WOD Express',
      description: 'Challenging Workout of the Day combining Olympic lifting and metabolic conditioning.',
      instructor: 'Kabir Mehta',
      category: 'CrossFit',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Koregaon Park, Pune',
      price: 999,
      capacity: 15,
      daysOffset: -2,
      startHour: 7,
      durationMinutes: 60,
    },
    {
      id: 'class-past-8',
      title: 'Functional Circuit Training',
      description: 'Dynamic bodyweight and kettlebell circuit to enhance everyday functional movement.',
      instructor: 'Ananya Sen',
      category: 'Functional Training',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
      location: 'HSR Layout Center, Bangalore',
      price: 899,
      capacity: 25,
      daysOffset: -2,
      startHour: 19,
      durationMinutes: 75,
    },
    {
      id: 'class-past-9',
      title: 'Full Body Mobility Reset',
      description: 'Targeted mobility and fascia release class for joint health and tension relief.',
      instructor: 'Vikram Malhotra',
      category: 'Mobility',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      location: 'Indiranagar Center, Bangalore',
      price: 599,
      capacity: 20,
      daysOffset: -1,
      startHour: 9,
      durationMinutes: 60,
    },
    {
      id: 'class-past-10',
      title: 'Core & Abs Sculpt',
      description: 'Intense abdominal core session building midsection stability and rotational strength.',
      instructor: 'Priya Sharma',
      category: 'Core Training',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Powai Studio, Mumbai',
      price: 499,
      capacity: 22,
      daysOffset: -1,
      startHour: 17,
      durationMinutes: 45,
    },
  ];

  const upsertedPastClasses = [];
  for (const item of pastClassesToSeed) {
    const startTime = getRelativeDate(item.daysOffset, item.startHour);
    const endTime = getEndDate(startTime, item.durationMinutes);

    const upserted = await prisma.fitnessClass.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        instructor: item.instructor,
        category: item.category,
        imageUrl: item.imageUrl,
        location: item.location,
        price: item.price,
        startTime,
        endTime,
        capacity: item.capacity,
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        instructor: item.instructor,
        category: item.category,
        imageUrl: item.imageUrl,
        location: item.location,
        price: item.price,
        startTime,
        endTime,
        capacity: item.capacity,
        availableSeats: item.capacity,
      },
    });
    upsertedPastClasses.push(upserted);
  }

  console.log(`Successfully seeded ${upsertedPastClasses.length} past fitness classes.`);
  return upsertedPastClasses;
}

async function seedFutureClasses() {
  console.log('Seeding upcoming fitness classes (today + 7 days)...');

  const futureClassesToSeed = [
    // Today (Day 0)
    {
      id: 'class-upcoming-1',
      title: 'Power Vinyasa Flow',
      description: 'Vigorous flow connecting breath with dynamic strength postures.',
      instructor: 'Vikram Malhotra',
      category: 'Yoga',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      location: 'Koregaon Park, Pune',
      price: 699,
      capacity: 20,
      daysOffset: 0,
      startHour: 7,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-2',
      title: 'High-Intensity Shred',
      description: 'Fast-paced calorie burning HIIT workout with plyometrics and weights.',
      instructor: 'Priya Sharma',
      category: 'HIIT',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Viman Nagar, Pune',
      price: 799,
      capacity: 25,
      daysOffset: 0,
      startHour: 11,
      durationMinutes: 45,
    },
    {
      id: 'class-upcoming-3',
      title: 'Heavy Lifters Strength',
      description: 'Compound resistance training emphasizing progressive overload.',
      instructor: 'Arjun Kapoor',
      category: 'Strength',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Bandra Hub, Mumbai',
      price: 999,
      capacity: 30,
      daysOffset: 0,
      startHour: 19,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-3b',
      title: 'Koramangala Morning Yoga',
      description: 'Refreshing morning stretch and breathing flow.',
      instructor: 'Vikram Malhotra',
      category: 'Yoga',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      location: 'Koramangala Studio, Bangalore',
      price: 599,
      capacity: 20,
      daysOffset: 0,
      startHour: 9,
      durationMinutes: 60,
    },

    // Day 1
    {
      id: 'class-upcoming-4',
      title: 'Reformer Pilates Essentials',
      description: 'Core-centric resistance training using spring tension for muscle toning.',
      instructor: 'Neha Gupta',
      category: 'Pilates',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      location: 'Baner Studio, Pune',
      price: 1199,
      capacity: 16,
      daysOffset: 1,
      startHour: 7,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-5',
      title: 'Zumba Fiesta Cardio',
      description: 'High-octane dance workout combining Latin & global rhythms.',
      instructor: 'Rajesh Varma',
      category: 'Dance Fitness',
      imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=800&auto=format&fit=crop',
      location: 'Andheri Fitness Center, Mumbai',
      price: 699,
      capacity: 35,
      daysOffset: 1,
      startHour: 17,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-6',
      title: 'Endurance Cardio Blast',
      description: 'Sustained aerobic conditioning focusing on stamina and lung capacity.',
      instructor: 'Divya Nair',
      category: 'Cardio',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Indiranagar Center, Bangalore',
      price: 799,
      capacity: 25,
      daysOffset: 1,
      startHour: 19,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-6b',
      title: 'Delhi Spin Blast',
      description: 'High cadence indoor spin challenge for serious cyclists.',
      instructor: 'Divya Nair',
      category: 'Cycling',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Connaught Place, Delhi',
      price: 899,
      capacity: 20,
      daysOffset: 1,
      startHour: 11,
      durationMinutes: 45,
    },

    // Day 2
    {
      id: 'class-upcoming-7',
      title: 'CrossFit Hero Challenge',
      description: 'High-energy CrossFit session with Olympic lifts and timed circuits.',
      instructor: 'Kabir Mehta',
      category: 'CrossFit',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Hadapsar Center, Pune',
      price: 1299,
      capacity: 15,
      daysOffset: 2,
      startHour: 9,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-8',
      title: 'Functional Athletic Training',
      description: 'Multi-planar movement patterns for speed, agility, and joint resilience.',
      instructor: 'Ananya Sen',
      category: 'Functional Training',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
      location: 'HSR Layout Center, Bangalore',
      price: 899,
      capacity: 20,
      daysOffset: 2,
      startHour: 11,
      durationMinutes: 75,
    },
    {
      id: 'class-upcoming-9',
      title: 'Sunset Rhythm Cycling',
      description: 'Indoor spin session riding to heavy bass tracks and resistance intervals.',
      instructor: 'Divya Nair',
      category: 'Cycling',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Powai Studio, Mumbai',
      price: 799,
      capacity: 20,
      daysOffset: 2,
      startHour: 17,
      durationMinutes: 45,
    },
    {
      id: 'class-upcoming-9b',
      title: 'Gachibowli Strength Circuit',
      description: 'Full-body resistance training and power lifting techniques.',
      instructor: 'Arjun Kapoor',
      category: 'Strength',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Gachibowli Studio, Hyderabad',
      price: 899,
      capacity: 25,
      daysOffset: 2,
      startHour: 19,
      durationMinutes: 60,
    },

    // Day 3
    {
      id: 'class-upcoming-10',
      title: 'Yin Yoga & Deep Stretch',
      description: 'Restorative yoga focusing on long holds and deep connective tissue release.',
      instructor: 'Vikram Malhotra',
      category: 'Yoga',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      location: 'Kothrud Hub, Pune',
      price: 599,
      capacity: 20,
      daysOffset: 3,
      startHour: 7,
      durationMinutes: 75,
    },
    {
      id: 'class-upcoming-11',
      title: 'Tabata HIIT Blitz',
      description: 'Ultra-intense 20s-on 10s-off intervals for maximum calorie burn.',
      instructor: 'Priya Sharma',
      category: 'HIIT',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Koramangala Studio, Bangalore',
      price: 799,
      capacity: 20,
      daysOffset: 3,
      startHour: 9,
      durationMinutes: 45,
    },
    {
      id: 'class-upcoming-12',
      title: 'Hypertrophy Upper Body',
      description: 'Isolated chest, back, and shoulder lifting for muscle definition.',
      instructor: 'Arjun Kapoor',
      category: 'Strength',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Bandra Hub, Mumbai',
      price: 999,
      capacity: 25,
      daysOffset: 3,
      startHour: 19,
      durationMinutes: 60,
    },

    // Day 4
    {
      id: 'class-upcoming-13',
      title: 'Sculpt & Tone Pilates',
      description: 'Low-impact burning sequences targeting glutes, legs, and abs.',
      instructor: 'Neha Gupta',
      category: 'Pilates',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      location: 'Indiranagar Center, Bangalore',
      price: 899,
      capacity: 18,
      daysOffset: 4,
      startHour: 9,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-14',
      title: 'Hip-Hop Dance Cardio',
      description: 'Upbeat urban dance routines designed to keep your heart rate up.',
      instructor: 'Rajesh Varma',
      category: 'Dance Fitness',
      imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=800&auto=format&fit=crop',
      location: 'Koregaon Park, Pune',
      price: 699,
      capacity: 30,
      daysOffset: 4,
      startHour: 17,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-15',
      title: 'Kickboxing Cardio Express',
      description: 'Combative kick and punch combinations for conditioning and stress relief.',
      instructor: 'Divya Nair',
      category: 'Cardio',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'South Delhi Hub, Delhi',
      price: 799,
      capacity: 25,
      daysOffset: 4,
      startHour: 19,
      durationMinutes: 45,
    },

    // Day 5
    {
      id: 'class-upcoming-16',
      title: 'CrossFit Skill & Strength',
      description: 'Gymnastic skills and heavy barbell complexes.',
      instructor: 'Kabir Mehta',
      category: 'CrossFit',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Andheri Fitness Center, Mumbai',
      price: 1299,
      capacity: 15,
      daysOffset: 5,
      startHour: 7,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-17',
      title: 'Agility & Core Functional',
      description: 'Ladder drills, bosu ball balance, and core stability work.',
      instructor: 'Ananya Sen',
      category: 'Functional Training',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
      location: 'Viman Nagar, Pune',
      price: 899,
      capacity: 20,
      daysOffset: 5,
      startHour: 11,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-18',
      title: 'Spinning Interval Challenge',
      description: 'Metric-tracked spin session targeting power output and recovery speed.',
      instructor: 'Divya Nair',
      category: 'Cycling',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Jubilee Hills, Hyderabad',
      price: 799,
      capacity: 20,
      daysOffset: 5,
      startHour: 17,
      durationMinutes: 45,
    },

    // Day 6
    {
      id: 'class-upcoming-19',
      title: 'Active Mobility & Stretch',
      description: 'Guided joint mobilization and muscular lengthening routines.',
      instructor: 'Vikram Malhotra',
      category: 'Mobility',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      location: 'Baner Studio, Pune',
      price: 599,
      capacity: 25,
      daysOffset: 6,
      startHour: 9,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-20',
      title: 'Core Stability & Balance',
      description: 'Isometric holds and rotational core strength drills.',
      instructor: 'Priya Sharma',
      category: 'Core Training',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'HSR Layout Center, Bangalore',
      price: 699,
      capacity: 20,
      daysOffset: 6,
      startHour: 11,
      durationMinutes: 45,
    },
    {
      id: 'class-upcoming-21',
      title: 'Power Strength & Conditioning',
      description: 'Full-body compound movements paired with accessory lifts.',
      instructor: 'Arjun Kapoor',
      category: 'Strength',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Powai Studio, Mumbai',
      price: 999,
      capacity: 25,
      daysOffset: 6,
      startHour: 19,
      durationMinutes: 90,
    },

    // Day 7
    {
      id: 'class-upcoming-22',
      title: 'Sunday Reset Vinyasa',
      description: 'Gentle flow to unwind the week and refresh body and mind.',
      instructor: 'Vikram Malhotra',
      category: 'Yoga',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      location: 'Hadapsar Center, Pune',
      price: 699,
      capacity: 20,
      daysOffset: 7,
      startHour: 9,
      durationMinutes: 60,
    },
    {
      id: 'class-upcoming-23',
      title: 'Full Body HIIT Marathon',
      description: 'End-of-week high energy cardiovascular and bodyweight challenge.',
      instructor: 'Priya Sharma',
      category: 'HIIT',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Koramangala Studio, Bangalore',
      price: 899,
      capacity: 30,
      daysOffset: 7,
      startHour: 17,
      durationMinutes: 60,
    },
  ];

  const upsertedFutureClasses = [];
  for (const item of futureClassesToSeed) {
    const startTime = getRelativeDate(item.daysOffset, item.startHour);
    const endTime = getEndDate(startTime, item.durationMinutes);

    const upserted = await prisma.fitnessClass.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        instructor: item.instructor,
        category: item.category,
        imageUrl: item.imageUrl,
        location: item.location,
        price: item.price,
        startTime,
        endTime,
        capacity: item.capacity,
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        instructor: item.instructor,
        category: item.category,
        imageUrl: item.imageUrl,
        location: item.location,
        price: item.price,
        startTime,
        endTime,
        capacity: item.capacity,
        availableSeats: item.capacity,
      },
    });
    upsertedFutureClasses.push(upserted);
  }

  console.log(`Successfully seeded ${upsertedFutureClasses.length} upcoming fitness classes.`);
  return upsertedFutureClasses;
}

async function seedBookings() {
  console.log('Seeding bookings across users and classes...');

  const bookingsToSeed: {
    id: string;
    userId: string;
    classId: string;
    status: BookingStatus;
    cancelledAt?: Date | null;
  }[] = [];

  const members = [
    'user-member-1',
    'user-member-2',
    'user-member-3',
    'user-member-4',
    'user-member-5',
    'user-member-6',
  ];
  const admins = ['user-admin-1', 'user-admin-2'];
  const allUsers = [...members, ...admins];

  // Helper to add active booking
  const addActive = (classId: string, userIds: string[]) => {
    for (const userId of userIds) {
      bookingsToSeed.push({
        id: `bk-${classId}-${userId}`,
        userId,
        classId,
        status: BookingStatus.ACTIVE,
      });
    }
  };

  // Helper to add cancelled booking
  const addCancelled = (classId: string, userIds: string[], daysAgoCancelled: number = 1) => {
    for (const userId of userIds) {
      const cancelledAt = new Date();
      cancelledAt.setDate(cancelledAt.getDate() - daysAgoCancelled);
      bookingsToSeed.push({
        id: `bk-${classId}-${userId}-canc`,
        userId,
        classId,
        status: BookingStatus.CANCELLED,
        cancelledAt,
      });
    }
  };

  // --- PAST CLASSES BOOKINGS ---
  addActive('class-past-1', members);
  addActive('class-past-1', ['user-admin-1']);
  addCancelled('class-past-1', ['user-admin-2'], 5);

  addActive('class-past-2', ['user-member-1', 'user-member-2', 'user-member-3', 'user-member-4']);
  addCancelled('class-past-2', ['user-member-5', 'user-member-6'], 5);

  addActive('class-past-3', ['user-member-2', 'user-member-3', 'user-member-4', 'user-member-5', 'user-member-6']);

  addActive('class-past-4', ['user-member-1', 'user-member-3', 'user-member-5']);
  addCancelled('class-past-4', ['user-member-2'], 4);

  addActive('class-past-5', members);

  addActive('class-past-6', ['user-member-2', 'user-member-4', 'user-member-5', 'user-member-6']);

  addActive('class-past-7', ['user-member-1', 'user-member-2', 'user-member-3', 'user-member-4', 'user-member-6']);
  addCancelled('class-past-7', ['user-member-5'], 2);

  addActive('class-past-8', ['user-member-1', 'user-member-4', 'user-member-5']);

  addActive('class-past-9', members);

  addActive('class-past-10', ['user-member-1', 'user-member-3', 'user-member-5', 'user-member-6']);
  addCancelled('class-past-10', ['user-member-4'], 1);

  // --- UPCOMING CLASSES BOOKINGS ---
  addActive('class-upcoming-1', ['user-member-1', 'user-member-2', 'user-member-3']);
  addActive('class-upcoming-2', ['user-member-1', 'user-member-4', 'user-member-5']);
  addActive('class-upcoming-3', ['user-member-2', 'user-member-3', 'user-member-4', 'user-member-5', 'user-member-6']);
  addActive('class-upcoming-3b', ['user-member-1', 'user-member-6']);

  addActive('class-upcoming-4', members);
  addActive('class-upcoming-5', ['user-member-1', 'user-member-6']);
  addActive('class-upcoming-6', ['user-member-2', 'user-member-3', 'user-member-4', 'user-member-5']);
  addActive('class-upcoming-6b', ['user-member-1', 'user-member-2']);

  addActive('class-upcoming-7', allUsers); // full capacity simulation
  addActive('class-upcoming-8', ['user-member-1', 'user-member-3', 'user-member-5', 'user-admin-1', 'user-admin-2']);
  addActive('class-upcoming-9', ['user-member-2', 'user-member-4', 'user-member-6']);
  addActive('class-upcoming-9b', ['user-member-3', 'user-member-5']);

  addActive('class-upcoming-10', ['user-member-1', 'user-member-2', 'user-member-3', 'user-member-4']);
  addActive('class-upcoming-11', ['user-member-4', 'user-member-5', 'user-member-6']);
  addActive('class-upcoming-12', ['user-member-1', 'user-member-3', 'user-member-5', 'user-admin-1']);

  addActive('class-upcoming-13', ['user-member-2', 'user-member-4', 'user-member-6']);
  addActive('class-upcoming-14', ['user-member-1', 'user-member-5']);
  addActive('class-upcoming-15', ['user-member-3', 'user-member-4']);

  addActive('class-upcoming-16', ['user-member-2', 'user-member-3', 'user-member-4', 'user-admin-2']);
  addActive('class-upcoming-17', ['user-member-1', 'user-member-3', 'user-member-6']);
  addActive('class-upcoming-18', ['user-member-2', 'user-member-5']);

  addActive('class-upcoming-19', ['user-member-1', 'user-member-2', 'user-member-3', 'user-member-4']);
  addActive('class-upcoming-20', ['user-member-4', 'user-member-5', 'user-member-6']);
  addActive('class-upcoming-21', ['user-member-1', 'user-member-3', 'user-member-5']);

  const upsertedBookings = [];
  for (const booking of bookingsToSeed) {
    const upserted = await prisma.booking.upsert({
      where: {
        userId_classId: {
          userId: booking.userId,
          classId: booking.classId,
        },
      },
      update: {
        status: booking.status,
        cancelledAt: booking.cancelledAt || (booking.status === BookingStatus.CANCELLED ? new Date() : null),
      },
      create: {
        id: booking.id,
        userId: booking.userId,
        classId: booking.classId,
        status: booking.status,
        cancelledAt: booking.cancelledAt || (booking.status === BookingStatus.CANCELLED ? new Date() : null),
      },
    });
    upsertedBookings.push(upserted);
  }

  console.log(`Successfully seeded ${upsertedBookings.length} bookings.`);
  return upsertedBookings;
}

async function updateAvailableSeats() {
  console.log('Calculating and updating accurate available seats for all classes...');

  const classes = await prisma.fitnessClass.findMany();

  for (const fitnessClass of classes) {
    const activeBookingCount = await prisma.booking.count({
      where: {
        classId: fitnessClass.id,
        status: BookingStatus.ACTIVE,
      },
    });

    const availableSeats = Math.max(0, fitnessClass.capacity - activeBookingCount);

    await prisma.fitnessClass.update({
      where: { id: fitnessClass.id },
      data: { availableSeats },
    });
  }

  console.log('Available seats updated successfully.');
}

async function main() {
  console.log('Starting SlotTrack database seed process...');

  // 1. Clean up existing records to ensure clean state
  console.log('Cleaning existing records...');
  await prisma.booking.deleteMany();
  await prisma.fitnessClass.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash password with bcrypt (10 rounds)
  const hashedPassword = await bcrypt.hash('Password@123', 10);

  // 3. Execute modular seeders
  await seedUsers(hashedPassword);
  await seedPastClasses();
  await seedFutureClasses();
  await seedBookings();
  await updateAvailableSeats();

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

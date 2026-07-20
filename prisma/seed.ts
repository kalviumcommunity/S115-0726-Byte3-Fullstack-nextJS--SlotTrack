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
    {
      id: 'user-admin',
      email: 'admin@slottrack.com',
      name: 'Admin User',
      role: Role.ADMIN,
    },
    {
      id: 'user-member-1',
      email: 'john.doe@slottrack.com',
      name: 'John Doe',
      role: Role.MEMBER,
    },
    {
      id: 'user-member-2',
      email: 'jane.doe@slottrack.com',
      name: 'Jane Doe',
      role: Role.MEMBER,
    },
    {
      id: 'user-member-3',
      email: 'bob.smith@slottrack.com',
      name: 'Bob Smith',
      role: Role.MEMBER,
    },
    {
      id: 'user-member-4',
      email: 'alice.johnson@slottrack.com',
      name: 'Alice Johnson',
      role: Role.MEMBER,
    },
    {
      id: 'user-member-5',
      email: 'charlie.brown@slottrack.com',
      name: 'Charlie Brown',
      role: Role.MEMBER,
    },
    {
      id: 'user-member-6',
      email: 'david.miller@slottrack.com',
      name: 'David Miller',
      role: Role.MEMBER,
    },
    {
      id: 'user-member-7',
      email: 'emily.davis@slottrack.com',
      name: 'Emily Davis',
      role: Role.MEMBER,
    },
    {
      id: 'user-member-8',
      email: 'frank.wilson@slottrack.com',
      name: 'Frank Wilson',
      role: Role.MEMBER,
    },
    {
      id: 'user-member-9',
      email: 'grace.taylor@slottrack.com',
      name: 'Grace Taylor',
      role: Role.MEMBER,
    },
    {
      id: 'user-member-10',
      email: 'henry.jones@slottrack.com',
      name: 'Henry Jones',
      role: Role.MEMBER,
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
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
    });
    upsertedUsers.push(upserted);
  }
  
  console.log(`Successfully seeded ${upsertedUsers.length} users.`);
  return upsertedUsers;
}

async function seedClasses() {
  console.log('Seeding fitness classes...');

  const classesToSeed = [
    // 1. Yoga (Past)
    {
      id: 'class-yoga-1',
      title: 'Morning Vinyasa Flow',
      description: 'Start your day with an energizing Vinyasa flow linking movement with breath. Suitable for all levels.',
      instructor: 'Sarah Jenkins',
      category: 'Yoga',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      location: 'Bandra Hub',
      capacity: 12,
      daysOffset: -2,
      startHour: 7,
      durationMinutes: 60,
    },
    // 2. HIIT (Past)
    {
      id: 'class-hiit-1',
      title: 'Full Body Burn',
      description: 'High-intensity interval training designed to push your limits, burn fat, and build cardiovascular endurance.',
      instructor: 'Mike Johnson',
      category: 'HIIT',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Andheri Studio',
      capacity: 15,
      daysOffset: -2,
      startHour: 9,
      durationMinutes: 60,
    },
    // 3. Strength (Past)
    {
      id: 'class-strength-1',
      title: 'Barbell Strength',
      description: 'Focus on compound lifts including squats, deadlifts, and presses. Build maximum strength and improve form.',
      instructor: 'David Smith',
      category: 'Strength',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Powai Center',
      capacity: 25,
      daysOffset: -1,
      startHour: 18,
      durationMinutes: 60,
    },
    // 4. Pilates (Past)
    {
      id: 'class-pilates-1',
      title: 'Core Sculpt Pilates',
      description: 'A low-impact, high-intensity workout focusing on core strength, muscle toning, and postural alignment.',
      instructor: 'Emma Wilson',
      category: 'Pilates',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      location: 'Indiranagar',
      capacity: 16,
      daysOffset: -1,
      startHour: 8,
      durationMinutes: 60,
    },
    // 5. Cardio (Today)
    {
      id: 'class-cardio-1',
      title: 'Aerobic Endurance',
      description: 'Boost your heart health with this dynamic aerobic workout. Perfect for building stamina.',
      instructor: 'James Taylor',
      category: 'Cardio',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Koramangala',
      capacity: 30,
      daysOffset: 0,
      startHour: 7,
      durationMinutes: 60,
    },
    // 6. Dance Fitness (Today)
    {
      id: 'class-dance-1',
      title: 'Dance Cardio Jam',
      description: 'An upbeat dance fitness class featuring hip-hop and pop rhythms. Burn calories while having fun!',
      instructor: 'Jessica Davis',
      category: 'Dance Fitness',
      imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=800&auto=format&fit=crop',
      location: 'Bandra Hub',
      capacity: 35,
      daysOffset: 0,
      startHour: 10,
      durationMinutes: 60,
    },
    // 7. Functional Training (Today)
    {
      id: 'class-functional-1',
      title: 'Functional Circuit',
      description: 'Circuit training designed to improve everyday movement patterns, agility, and overall fitness.',
      instructor: 'Robert Clark',
      category: 'Functional Training',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
      location: 'Powai Center',
      capacity: 20,
      daysOffset: 0,
      startHour: 17,
      durationMinutes: 90,
    },
    // 8. Zumba (Today)
    {
      id: 'class-zumba-1',
      title: 'Latin Zumba Dance',
      description: 'Latin-inspired dance workout that is friendly, energetic, and highly engaging for all levels.',
      instructor: 'Linda Martinez',
      category: 'Zumba',
      imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=800&auto=format&fit=crop',
      location: 'Andheri Studio',
      capacity: 40,
      daysOffset: 0,
      startHour: 19,
      durationMinutes: 60,
    },
    // 9. CrossFit (Tomorrow - Completely Full)
    {
      id: 'class-crossfit-1',
      title: 'WOD: Power & Grace',
      description: 'CrossFit Workout of the Day focusing on Olympic lifting, gymnastics, and high-intensity conditioning.',
      instructor: 'William Brown',
      category: 'CrossFit',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Indiranagar',
      capacity: 10,
      daysOffset: 1,
      startHour: 6,
      durationMinutes: 60,
    },
    // 10. Cycling (Tomorrow)
    {
      id: 'class-cycling-1',
      title: 'Rhythm Spin Class',
      description: 'High-energy indoor cycling class synced to high-tempo beats. Get ready to climb, sprint, and sweat.',
      instructor: 'Patricia Lee',
      category: 'Cycling',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Koramangala',
      capacity: 25,
      daysOffset: 1,
      startHour: 8,
      durationMinutes: 45,
    },
    // 11. Yoga (Tomorrow)
    {
      id: 'class-yoga-2',
      title: 'Hatha & Yin Restore',
      description: 'Deep stretching and long holds to release tension and calm the nervous system. Ideal for relaxation.',
      instructor: 'Sarah Jenkins',
      category: 'Yoga',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      location: 'Powai Center',
      capacity: 20,
      daysOffset: 1,
      startHour: 18,
      durationMinutes: 75,
    },
    // 12. Strength (Future)
    {
      id: 'class-strength-2',
      title: 'Hypertrophy Upper Body',
      description: 'Focus on high-volume training targeting chest, back, shoulders, and arms to build definition.',
      instructor: 'David Smith',
      category: 'Strength',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Bandra Hub',
      capacity: 25,
      daysOffset: 2,
      startHour: 11,
      durationMinutes: 60,
    },
    // 13. HIIT (Future - Almost Full)
    {
      id: 'class-hiit-2',
      title: 'Tabata Protocol',
      description: '4-minute interval rounds consisting of 20 seconds of intense work and 10 seconds of rest.',
      instructor: 'Mike Johnson',
      category: 'HIIT',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Andheri Studio',
      capacity: 12,
      daysOffset: 2,
      startHour: 16,
      durationMinutes: 45,
    },
    // 14. Pilates (Future - Completely Full)
    {
      id: 'class-pilates-2',
      title: 'Power Reformer & Mat',
      description: 'Advanced Pilates session integrating classic mat sequences with resistance training.',
      instructor: 'Emma Wilson',
      category: 'Pilates',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      location: 'Indiranagar',
      capacity: 8,
      daysOffset: 2,
      startHour: 9,
      durationMinutes: 60,
    },
    // 15. CrossFit (Future)
    {
      id: 'class-crossfit-2',
      title: 'CrossFit Hero WOD',
      description: 'A challenging, endurance-focused Hero workout to build stamina, mental toughness, and strength.',
      instructor: 'William Brown',
      category: 'CrossFit',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Bandra Hub',
      capacity: 15,
      daysOffset: 3,
      startHour: 7,
      durationMinutes: 60,
    },
    // 16. Cycling (Future)
    {
      id: 'class-cycling-2',
      title: 'FTP Climb Session',
      description: 'A cycling class focusing on power zones, resistance climbing, and metric tracking.',
      instructor: 'Patricia Lee',
      category: 'Cycling',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Koramangala',
      capacity: 20,
      daysOffset: 3,
      startHour: 18,
      durationMinutes: 60,
    },
    // 17. Yoga (Future)
    {
      id: 'class-yoga-3',
      title: 'Ashtanga Primary Series',
      description: 'A structured sequence of postures designed to purify, strengthen, and align the body.',
      instructor: 'Sarah Jenkins',
      category: 'Yoga',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      location: 'Andheri Studio',
      capacity: 20,
      daysOffset: 3,
      startHour: 8,
      durationMinutes: 90,
    },
    // 18. Cardio (Future)
    {
      id: 'class-cardio-2',
      title: 'Cardio Kickboxing',
      description: 'Kick, punch, and sweat your way through this high-energy combat-inspired cardio session.',
      instructor: 'James Taylor',
      category: 'Cardio',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Powai Center',
      capacity: 30,
      daysOffset: 4,
      startHour: 19,
      durationMinutes: 60,
    },
    // 19. Functional Training (Future)
    {
      id: 'class-functional-2',
      title: 'Core & Balance Circuit',
      description: 'Improve balance, coordination, and stabilizing muscles with targeted functional exercises.',
      instructor: 'Robert Clark',
      category: 'Functional Training',
      imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
      location: 'Indiranagar',
      capacity: 20,
      daysOffset: 4,
      startHour: 10,
      durationMinutes: 60,
    },
    // 20. Zumba (Future)
    {
      id: 'class-zumba-2',
      title: 'Aqua Zumba Splash',
      description: 'A water-based dance-fitness party combining Zumba formula with low-impact pool resistance.',
      instructor: 'Linda Martinez',
      category: 'Zumba',
      imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=800&auto=format&fit=crop',
      location: 'Bandra Hub',
      capacity: 30,
      daysOffset: 4,
      startHour: 12,
      durationMinutes: 60,
    },
    // 21. Strength (Future)
    {
      id: 'class-strength-3',
      title: 'Powerlifting Essentials',
      description: 'In-depth session focusing on technique, progression, and safety in Bench Press, Squat, and Deadlift.',
      instructor: 'David Smith',
      category: 'Strength',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      location: 'Powai Center',
      capacity: 20,
      daysOffset: 5,
      startHour: 17,
      durationMinutes: 90,
    },
    // 22. HIIT (Future)
    {
      id: 'class-hiit-3',
      title: 'Metabolic Conditioning',
      description: 'A fast-paced workout combining bodyweight, dumbbells, and cardio intervals to maximize calorie burn.',
      instructor: 'Mike Johnson',
      category: 'HIIT',
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      location: 'Andheri Studio',
      capacity: 20,
      daysOffset: 5,
      startHour: 9,
      durationMinutes: 60,
    },
  ];

  const upsertedClasses = [];
  for (const item of classesToSeed) {
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
        startTime,
        endTime,
        capacity: item.capacity,
        availableSeats: item.capacity, // initially set to capacity
      },
    });
    upsertedClasses.push(upserted);
  }

  console.log(`Successfully seeded ${upsertedClasses.length} fitness classes.`);
  return upsertedClasses;
}

async function seedBookings() {
  console.log('Seeding bookings...');

  const bookingsToSeed: {
    id: string;
    userId: string;
    classId: string;
    status: BookingStatus;
  }[] = [];

  // Helper to generate active bookings for a range of member numbers
  const addActiveBookings = (classId: string, startMember: number, endMember: number) => {
    for (let i = startMember; i <= endMember; i++) {
      bookingsToSeed.push({
        id: `booking-${classId}-mem-${i}`,
        userId: `user-member-${i}`,
        classId,
        status: BookingStatus.ACTIVE,
      });
    }
  };

  // 1. class-crossfit-1 (Capacity 10, completely full)
  addActiveBookings('class-crossfit-1', 1, 10);

  // 2. class-pilates-2 (Capacity 8, completely full)
  addActiveBookings('class-pilates-2', 1, 8);

  // 3. class-hiit-2 (Capacity 12, almost full - 11 bookings)
  addActiveBookings('class-hiit-2', 1, 10);
  bookingsToSeed.push({
    id: 'booking-class-hiit-2-admin',
    userId: 'user-admin',
    classId: 'class-hiit-2',
    status: BookingStatus.ACTIVE,
  });

  // 4. class-yoga-1 (Capacity 12, active: 8, cancelled: 1)
  addActiveBookings('class-yoga-1', 1, 8);
  bookingsToSeed.push({
    id: 'booking-class-yoga-1-admin-cancelled',
    userId: 'user-admin',
    classId: 'class-yoga-1',
    status: BookingStatus.CANCELLED,
  });

  // 5. class-yoga-2 (Capacity 20, half-full: 10 active)
  addActiveBookings('class-yoga-2', 1, 10);

  // 6. class-pilates-1 (Capacity 16, half-full: 8 active)
  addActiveBookings('class-pilates-1', 1, 8);

  // 7. class-strength-1 (Capacity 25, active: 0, cancelled: 3)
  bookingsToSeed.push({
    id: 'booking-class-strength-1-mem-1-cancelled',
    userId: 'user-member-1',
    classId: 'class-strength-1',
    status: BookingStatus.CANCELLED,
  });
  bookingsToSeed.push({
    id: 'booking-class-strength-1-mem-2-cancelled',
    userId: 'user-member-2',
    classId: 'class-strength-1',
    status: BookingStatus.CANCELLED,
  });
  bookingsToSeed.push({
    id: 'booking-class-strength-1-mem-3-cancelled',
    userId: 'user-member-3',
    classId: 'class-strength-1',
    status: BookingStatus.CANCELLED,
  });

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
        cancelledAt: booking.status === BookingStatus.CANCELLED ? new Date() : null,
      },
      create: {
        id: booking.id,
        userId: booking.userId,
        classId: booking.classId,
        status: booking.status,
        cancelledAt: booking.status === BookingStatus.CANCELLED ? new Date() : null,
      },
    });
    upsertedBookings.push(upserted);
  }

  console.log(`Successfully seeded ${upsertedBookings.length} bookings.`);
  return upsertedBookings;
}

async function updateAvailableSeats() {
  console.log('Calculating and updating available seats for all classes...');

  // Get all classes
  const classes = await prisma.fitnessClass.findMany();

  for (const fitnessClass of classes) {
    // Count active bookings for this class
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
  console.log('Starting seed process...');
  
  // 1. Clean up existing records to prevent conflicts with old seed data
  console.log('Cleaning up database...');
  await prisma.booking.deleteMany();
  await prisma.fitnessClass.deleteMany();
  await prisma.user.deleteMany();
  
  // 2. Precompute hashed password
  const hashedPassword = await bcrypt.hash('Password@123', 10);
  
  // 3. Run seeders sequentially
  await seedUsers(hashedPassword);
  await seedClasses();
  await seedBookings();
  await updateAvailableSeats();

  console.log('Database seed complete!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // close pg pool to prevent hanging
  });

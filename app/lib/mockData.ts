import { FitnessClass } from "../interfaces/class";

// Utility to get today's date formatted as YYYY-MM-DD
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // returns YYYY-MM-DD
};

// Formats a date string as "D MMM YYYY" (e.g. "10 Jul 2026")
export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const INITIAL_CLASSES: FitnessClass[] = [
  // Today's classes (for the schedule grid)
  {
    id: "today-1",
    title: "Yoga",
    category: "Yoga",
    instructor: "John",
    startTime: "07:00 AM",
    endTime: "08:00 AM",
    date: getTodayDateString(),
    capacity: 20,
    availableSeats: 2, // 18 booked
  },
  {
    id: "today-2",
    title: "Strength Training",
    category: "Strength",
    instructor: "John",
    startTime: "08:00 AM",
    endTime: "09:00 AM",
    date: getTodayDateString(),
    capacity: 20,
    availableSeats: 3, // 17 booked
  },
  {
    id: "today-3",
    title: "HIIT Cardio",
    category: "Cardio",
    instructor: "John",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    date: getTodayDateString(),
    capacity: 20,
    availableSeats: 2, // 18 booked
  },
  {
    id: "today-4",
    title: "Calisthenics",
    category: "Calisthenics",
    instructor: "John",
    startTime: "04:00 PM",
    endTime: "06:00 PM",
    date: getTodayDateString(),
    capacity: 20,
    availableSeats: 5, // 15 booked
  },
  {
    id: "today-5",
    title: "Meditation",
    category: "Meditation",
    instructor: "John",
    startTime: "06:00 PM",
    endTime: "07:00 PM",
    date: getTodayDateString(),
    capacity: 20,
    availableSeats: 0, // 20 booked
  },

  // Class History (Past classes)
  {
    id: "hist-1",
    title: "Strength Training",
    category: "Strength",
    instructor: "John",
    startTime: "08:00 AM",
    endTime: "09:00 AM",
    date: "2026-07-10",
    capacity: 20,
    availableSeats: 1, // 19 booked
  },
  {
    id: "hist-2",
    title: "Yoga",
    category: "Yoga",
    instructor: "John",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    date: "2026-07-10",
    capacity: 25,
    availableSeats: 5, // 20 booked
  },
  {
    id: "hist-3",
    title: "HIIT Cardio",
    category: "Cardio",
    instructor: "John",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    date: "2026-07-10",
    capacity: 20,
    availableSeats: 2, // 18 booked
  },
  {
    id: "hist-4",
    title: "Meditation",
    category: "Meditation",
    instructor: "John",
    startTime: "06:00 AM",
    endTime: "07:00 AM",
    date: "2026-07-10",
    capacity: 15,
    availableSeats: 0, // 15 booked
  },
  {
    id: "hist-5",
    title: "Calisthenics",
    category: "Calisthenics",
    instructor: "John",
    startTime: "04:00 PM",
    endTime: "06:00 PM",
    date: "2026-07-09",
    capacity: 20,
    availableSeats: 1, // 19 booked
  },
  
  // Extra history classes for pagination (pages 2 and 3)
  {
    id: "hist-6",
    title: "Yoga Flow",
    category: "Yoga",
    instructor: "John",
    startTime: "07:00 AM",
    endTime: "08:00 AM",
    date: "2026-07-08",
    capacity: 15,
    availableSeats: 3, // 12 booked
  },
  {
    id: "hist-7",
    title: "Pilates Core",
    category: "Strength",
    instructor: "John",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    date: "2026-07-08",
    capacity: 20,
    availableSeats: 8, // 12 booked
  },
  {
    id: "hist-8",
    title: "Zumba Dance",
    category: "Cardio",
    instructor: "John",
    startTime: "05:00 PM",
    endTime: "06:00 PM",
    date: "2026-07-07",
    capacity: 30,
    availableSeats: 5, // 25 booked
  },
  {
    id: "hist-9",
    title: "Yoga Nidra",
    category: "Meditation",
    instructor: "John",
    startTime: "08:00 PM",
    endTime: "09:00 PM",
    date: "2026-07-07",
    capacity: 12,
    availableSeats: 0, // 12 booked
  },
  {
    id: "hist-10",
    title: "Bodyweight Blast",
    category: "Calisthenics",
    instructor: "John",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    date: "2026-07-06",
    capacity: 20,
    availableSeats: 4, // 16 booked
  },
  {
    id: "hist-11",
    title: "Power Yoga",
    category: "Yoga",
    instructor: "John",
    startTime: "06:00 AM",
    endTime: "07:00 AM",
    date: "2026-07-05",
    capacity: 25,
    availableSeats: 5, // 20 booked
  },
  {
    id: "hist-12",
    title: "Kettlebell Conditioning",
    category: "Strength",
    instructor: "John",
    startTime: "04:30 PM",
    endTime: "05:30 PM",
    date: "2026-07-04",
    capacity: 15,
    availableSeats: 2, // 13 booked
  }
];

export interface DashboardClass {
  id: string;
  title: string;
  category: string;
  image: string;
  time: string;
  date: string;
  location: string;
  description: string;
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  instructorBio: string;
  duration: string;
  intensity: string;
  equipment: string;
  capacity: number;
  availableSeats: number;
}

export const DASHBOARD_CLASSES: DashboardClass[] = [
  {
    id: "class-1",
    title: "Strength Training",
    category: "Strength",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    time: "8:00 AM - 9:00 AM",
    date: "Monday",
    location: "Hadapsar, Pune",
    description: "Build muscle, increase strength, and improve your overall fitness with this full-body resistance training session.",
    instructorName: "Frog Eyes",
    instructorRole: "Strength Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200",
    instructorBio: "Certified strength specialist with 8+ years of experience training elite athletes and beginners alike.",
    duration: "60 mins",
    intensity: "High",
    equipment: "Barbells, Dumbbells",
    capacity: 20,
    availableSeats: 5,
  },
  {
    id: "class-2",
    title: "Yoga Flow",
    category: "Yoga",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    time: "9:00 AM - 10:00 AM",
    date: "Monday",
    location: "Hadapsar, Pune",
    description: "Flow through a sequence of postures linking breath with movement. Perfect for building flexibility, balance, and mindfulness.",
    instructorName: "Frog Eyes",
    instructorRole: "Yoga Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200",
    instructorBio: "Experienced yoga guide specializing in Vinyasa and Hatha styles. Focused on alignment and inner peace.",
    duration: "60 mins",
    intensity: "Medium",
    equipment: "Yoga Mat, Blocks",
    capacity: 25,
    availableSeats: 12,
  },
  {
    id: "class-3",
    title: "HIIT Cardio",
    category: "Cardio",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop",
    time: "10:00 AM - 11:00 AM",
    date: "Monday",
    location: "Hadapsar, Pune",
    description: "High Intensity Interval Training to boost cardiovascular endurance and burn fat. Expect fast-paced bodyweight and cardio intervals.",
    instructorName: "Frog Eyes",
    instructorRole: "HIIT Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200",
    instructorBio: "Energetic trainer passionate about high-octane workouts and building functional athletic performance.",
    duration: "60 mins",
    intensity: "High",
    equipment: "None (Bodyweight)",
    capacity: 20,
    availableSeats: 8,
  },
  {
    id: "class-4",
    title: "Meditation Zen",
    category: "Mind",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
    time: "6:00 AM - 7:00 AM",
    date: "Monday",
    location: "Hadapsar, Pune",
    description: "Calm your mind and start your day with focus. This class covers guided meditation, breathing techniques, and deep relaxation.",
    instructorName: "Frog Eyes",
    instructorRole: "Mindfulness Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200",
    instructorBio: "Meditation expert dedicated to teaching stress relief, mindfulness, and breathing exercises for daily peace.",
    duration: "60 mins",
    intensity: "Low",
    equipment: "Meditation Cushion",
    capacity: 15,
    availableSeats: 10,
  },
  {
    id: "class-5",
    title: "Calisthenics Core",
    category: "Strength",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop",
    time: "4:00 PM - 5:00 PM",
    date: "Monday",
    location: "Hadapsar, Pune",
    description: "Master your bodyweight. Focus on gymnastics-inspired strength movements like pull-ups, push-ups, and core stabilization.",
    instructorName: "Frog Eyes",
    instructorRole: "Calisthenics Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200",
    instructorBio: "Calisthenics practitioner specializing in body weight mastery, handstands, and progressive strength skills.",
    duration: "60 mins",
    intensity: "High",
    equipment: "Pull-up Bar, Rings",
    capacity: 20,
    availableSeats: 4,
  },
  {
    id: "class-6",
    title: "Zumba Dance",
    category: "Cardio",
    image: "https://images.unsplash.com/photo-1524594152303-9fd13543dd6e?q=80&w=800&auto=format&fit=crop",
    time: "4:00 PM - 5:00 PM",
    date: "Monday",
    location: "Hadapsar, Pune",
    description: "Dance your way to fitness! An upbeat cardio dance class featuring Latin and international rhythms. Fun and energetic.",
    instructorName: "Frog Eyes",
    instructorRole: "Zumba Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200",
    instructorBio: "Certified Zumba instructor bringing high energy and dance floor excitement to every calorie-burning session.",
    duration: "60 mins",
    intensity: "Medium",
    equipment: "Comfortable Shoes",
    capacity: 30,
    availableSeats: 15,
  }
];


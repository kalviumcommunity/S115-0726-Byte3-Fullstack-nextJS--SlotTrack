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

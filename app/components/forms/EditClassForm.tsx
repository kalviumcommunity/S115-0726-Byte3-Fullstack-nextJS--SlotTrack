"use client";

import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { FitnessClass } from "../../interfaces/class";

interface EditClassFormProps {
  initialClass: FitnessClass;
  onSubmit: (data: {
    id: string;
    title: string;
    category: string;
    startTime: string;
    endTime: string;
    date: string;
    capacity: number;
  }) => void;
  onCancel: () => void;
}

const CATEGORIES = ["Yoga", "Strength", "Cardio", "Calisthenics", "Meditation"];

const convert12hrTo24hr = (time12h: string) => {
  if (!time12h) return "";
  try {
    const [time, modifier] = time12h.split(" ");
    const [hours, minutes] = time.split(":");
    let displayHours = hours;
    if (hours === "12") {
      displayHours = "00";
    }
    if (modifier === "PM") {
      displayHours = String(parseInt(hours, 10) + 12);
    }
    return `${displayHours.padStart(2, "0")}:${minutes}`;
  } catch {
    return time12h;
  }
};

export default function EditClassForm({ initialClass, onSubmit, onCancel }: EditClassFormProps) {
  const [title, setTitle] = useState(initialClass.title);
  const [category, setCategory] = useState(initialClass.category);
  const [date, setDate] = useState(initialClass.date);
  const [startTime, setStartTime] = useState(() => convert12hrTo24hr(initialClass.startTime));
  const [endTime, setEndTime] = useState(() => convert12hrTo24hr(initialClass.endTime));
  const [capacity, setCapacity] = useState(initialClass.capacity);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Class name is required";
    if (!date) newErrors.date = "Date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formatTime12hr = (timeStr: string) => {
      if (!timeStr) return "";
      if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
      const [hoursStr, minutesStr] = timeStr.split(":");
      const hours = parseInt(hoursStr);
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const formattedHours = displayHours < 10 ? `0${displayHours}` : `${displayHours}`;
      return `${formattedHours}:${minutesStr} ${ampm}`;
    };

    onSubmit({
      id: initialClass.id,
      title,
      category,
      date,
      startTime: formatTime12hr(startTime),
      endTime: formatTime12hr(endTime),
      capacity,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-manrope">
      <Input
        label="Class Name"
        id="edit-class-title"
        placeholder="e.g. Yoga, HIIT Cardio"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
      />

      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor="edit-class-category" className="text-sm font-semibold text-text-primary">
          Category
        </label>
        <select
          id="edit-class-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-11 px-3.5 bg-surface border border-border rounded-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-manrope cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Date"
        id="edit-class-date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Time"
          id="edit-class-start-time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          error={errors.startTime}
          required
        />
        <Input
          label="End Time"
          id="edit-class-end-time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          error={errors.endTime}
          required
        />
      </div>

      <Input
        label="Capacity"
        id="edit-class-capacity"
        type="number"
        min={1}
        value={capacity}
        onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
        error={errors.capacity}
        required
      />

      <div className="flex items-center justify-end gap-3 mt-4 border-t border-border pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="cursor-pointer">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="cursor-pointer">
          Save Changes
        </Button>
      </div>
    </form>
  );
}

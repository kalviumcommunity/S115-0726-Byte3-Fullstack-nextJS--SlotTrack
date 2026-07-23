"use client";
 
import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { LOCATIONS } from "../navigation/LocationSelector";

interface CreateClassFormProps {
  onSubmit: (data: {
    title: string;
    category: string;
    location: string;
    detailedLocation?: string;
    startTime: string;
    endTime: string;
    date: string;
    capacity: number;
    price: number;
  }) => void;
  onCancel: () => void;
}

const CATEGORIES = ["Yoga", "Strength", "Cardio", "Calisthenics", "Meditation"];

export default function CreateClassForm({ onSubmit, onCancel }: CreateClassFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [detailedLocation, setDetailedLocation] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState(20);
  const [price, setPrice] = useState("299.00");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Class name is required";
    if (!location) newErrors.location = "Location is required";
    if (!date) newErrors.date = "Date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";
    
    const parsedPrice = parseFloat(price);
    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

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
      title,
      category,
      location,
      detailedLocation: detailedLocation.trim() || undefined,
      date,
      startTime: formatTime12hr(startTime),
      endTime: formatTime12hr(endTime),
      capacity,
      price: parseFloat(price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-manrope">
      <Input
        label="Class Name"
        id="class-title"
        placeholder="e.g. Yoga, HIIT Cardio"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
      />

      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor="class-category" className="text-sm font-semibold text-text-primary">
          Category
        </label>
        <select
          id="class-category"
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

      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor="class-location" className="text-sm font-semibold text-text-primary">
          Location
        </label>
        <select
          id="class-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full h-11 px-3.5 bg-surface border border-border rounded-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-manrope cursor-pointer"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {errors.location && <span className="text-xs text-danger">{errors.location}</span>}
      </div>

      <Input
        label="Venue / Detailed Location"
        id="class-detailed-location"
        placeholder="e.g. Amanora Mall, 5th Floor, Hadapsar, Pune 411028"
        value={detailedLocation}
        onChange={(e) => setDetailedLocation(e.target.value)}
        error={errors.detailedLocation}
      />

      <Input
        label="Date"
        id="class-date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Time"
          id="class-start-time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          error={errors.startTime}
          required
        />
        <Input
          label="End Time"
          id="class-end-time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          error={errors.endTime}
          required
        />
      </div>

      <Input
        label="Capacity"
        id="class-capacity"
        type="number"
        min={1}
        value={capacity}
        onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
        error={errors.capacity}
        required
      />

      <div className="relative">
        <Input
          label="Price"
          id="class-price"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="e.g. 299.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="pl-8"
          error={errors.price}
          required
        />
        <span className="absolute left-3.5 top-[38px] text-sm font-semibold text-text-secondary select-none">
          ₹
        </span>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4 border-t border-border pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} className="cursor-pointer">
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="cursor-pointer">
          Create Class
        </Button>
      </div>
    </form>
  );
}

"use client";

import React from "react";
import ClassCard, { ClassCardProps } from "./ClassCard";

export interface ClassGridProps {
  classes: ClassCardProps[];
  onBookToggle: (id: string) => void;
}

export default function ClassGrid({ classes, onBookToggle }: ClassGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
      {classes.map((cls) => (
        <ClassCard
          key={cls.id}
          id={cls.id}
          title={cls.title}
          category={cls.category}
          image={cls.image}
          time={cls.time}
          date={cls.date}
          location={cls.location}
          price={cls.price}
          isBooked={cls.isBooked}
          onBookToggle={onBookToggle}
        />
      ))}
    </div>
  );
}

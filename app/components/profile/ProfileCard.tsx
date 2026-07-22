"use client";

import React, { useState } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

export interface ProfileCardProps {
  name?: string;
  age?: number;
  contact?: string;
  gender?: string;
  avatarUrl?: string;
  onEditToggle?: (name: string, age?: number, gender?: string) => void;
}

export default function ProfileCard({
  name = "John Doe",
  age = 21,
  contact = "XXXXXXXXXX",
  gender = "Male",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  onEditToggle,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name, age, contact, gender });

  React.useEffect(() => {
    setFormData({ name, age, contact, gender });
  }, [name, age, contact, gender]);

  const handleSave = () => {
    setIsEditing(false);
    if (onEditToggle) onEditToggle(formData.name, formData.age !== undefined && formData.age !== null ? Number(formData.age) : undefined, formData.gender);
  };

  return (
    <div className="bg-white border border-[#EEF2F6] rounded-[24px] shadow-[0_8px_32px_rgba(15,23,42,0.06)] p-6 relative overflow-hidden transition-all duration-300">
      {/* Edit Trigger Top Corner */}
      <button
        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        className="absolute top-0 right-0 bg-[#EEF2F6] hover:bg-[#e2e8f0] text-[#111827] border-l border-b border-[#EEF2F6] text-sm font-bold py-3.5 px-6 rounded-bl-[15px] transition-colors duration-200 select-none cursor-pointer flex items-center space-x-1.5 active:scale-95"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          {isEditing ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          )}
        </svg>
        <span>{isEditing ? "Save" : "Edit"}</span>
      </button>

      {/* Profile Header Content */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
        <Avatar src={avatarUrl} alt={name} size="xl" className="shadow-md" />

        <div className="flex-1 space-y-2.5 text-center sm:text-left">
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="font-sans font-bold text-2xl border border-[#EEF2F6] rounded-lg px-2.5 py-1 text-[#111827] outline-[#72BF6A]"
            />
          ) : (
            <h2 className="font-sans font-bold text-3xl text-[#111827] leading-none mb-1">
              {formData.name}
            </h2>
          )}

          <div className="space-y-1.5 text-[#111827]/80 font-sans font-semibold text-sm md:text-base">
            <div className="flex justify-center sm:justify-start items-center space-x-1.5">
              <span className="text-[#6B7280]">Age:</span>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.age ?? ""}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value === "" ? (undefined as any) : Number(e.target.value) })}
                  className="w-16 border border-[#EEF2F6] rounded px-1.5 py-0.5 outline-[#72BF6A]"
                />
              ) : (
                <span>{formData.age}</span>
              )}
            </div>

            <div className="flex justify-center sm:justify-start items-center space-x-1.5">
              <span className="text-[#6B7280]">Email:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.contact}
                  className="border border-[#EEF2F6] rounded px-1.5 py-0.5 outline-[#72BF6A] bg-[#F1F5F9] cursor-not-allowed"
                  disabled
                />
              ) : (
                <span>{formData.contact}</span>
              )}
            </div>

            <div className="flex justify-center sm:justify-start items-center space-x-1.5">
              <span className="text-[#6B7280]">Gender:</span>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="border border-[#EEF2F6] rounded px-1.5 py-0.5 outline-[#72BF6A]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span>{formData.gender}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

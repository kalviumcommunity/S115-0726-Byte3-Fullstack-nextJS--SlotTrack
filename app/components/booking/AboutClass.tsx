import React from "react";
import { Clock, BarChart, Shield, Users } from "lucide-react";

interface AboutClassProps {
    description?: string;
    duration?: string;
    intensity?: string;
    equipment?: string;
    capacity?: number;
}

export default function AboutClass({
    description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo",
    duration = "60 mins",
    intensity = "Medium",
    equipment = "60 mins", // Keep screenshot placeholder structure, though it is likely a typo in Figma design for Equipment. Let's make it customizable.
    capacity = 25,
}: AboutClassProps) {
    return (
        <div className="w-full">
            <h3 className="font-display text-lg font-bold text-text-primary mb-4">
                About Class
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary mb-8">
                {description}
            </p>

            {/* Grid of details */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-gray-100 pt-6">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="font-manrope text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#72BF6A' }}>Duration</span>
                    <span className="font-manrope text-sm font-bold text-text-primary">{duration}</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="font-manrope text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#72BF6A' }}>Intensity</span>
                    <span className="font-manrope text-sm font-bold text-text-primary">{intensity}</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="font-manrope text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#72BF6A' }}>Equipment</span>
                    <span className="font-manrope text-sm font-bold text-text-primary">{equipment}</span>
                </div>

                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="font-manrope text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#72BF6A' }}>Paricipants</span>
                    <span className="font-manrope text-sm font-bold text-text-primary">Max {capacity}</span>
                </div>
            </div>
        </div>
    );
}

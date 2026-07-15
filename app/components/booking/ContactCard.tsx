import React from "react";
import { Phone, Mail } from "lucide-react";

interface ContactCardProps {
    phone?: string;
    email?: string;
}

export default function ContactCard({
    phone = "1234567890",
    email = "support.slottrack@cult.fit",
}: ContactCardProps) {
    return (
        <div
            className="w-full rounded-[20px] flex flex-col sm:flex-row items-stretch overflow-hidden"
            style={{ backgroundColor: "#72BF6A" }}
        >
            {/* Left: Support text */}
            <div className="flex flex-col justify-center px-8 py-7 flex-1">
                <p
                    className="text-white uppercase tracking-widest mb-1"
                    style={{
                        fontFamily: "Manrope, sans-serif",
                        fontWeight: 700,
                        fontSize: "13px",
                        letterSpacing: "0.12em",
                    }}
                >
                    SUPPORT
                </p>
                <p
                    className="text-white leading-snug"
                    style={{
                        fontFamily: "Manrope, sans-serif",
                        fontWeight: 500,
                        fontSize: "13px",
                        maxWidth: "280px",
                        opacity: 0.95,
                    }}
                >
                    For any issues or queries related to this class, contact Us.
                </p>
            </div>

            {/* Vertical Divider */}
            <div
                className="hidden sm:block self-stretch"
                style={{
                    width: "2px",
                    backgroundColor: "rgba(255,255,255,0.7)",
                    margin: "20px 0",
                }}
            />

            {/* Right: Contact details */}
            <div className="flex flex-col justify-center gap-4 px-8 py-7 sm:min-w-[260px]">
                {/* Phone */}
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "rgba(255,255,255,0.25)",
                            flexShrink: 0,
                        }}
                    >
                        <Phone size={18} color="#ffffff" />
                    </div>
                    <a
                        href={`tel:${phone}`}
                        className="text-white hover:opacity-80 transition-opacity"
                        style={{
                            fontFamily: "Manrope, sans-serif",
                            fontWeight: 600,
                            fontSize: "15px",
                        }}
                    >
                        {phone}
                    </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "rgba(255,255,255,0.25)",
                            flexShrink: 0,
                        }}
                    >
                        <Mail size={18} color="#ffffff" />
                    </div>
                    <a
                        href={`mailto:${email}`}
                        className="text-white hover:opacity-80 transition-opacity break-all"
                        style={{
                            fontFamily: "Manrope, sans-serif",
                            fontWeight: 600,
                            fontSize: "15px",
                        }}
                    >
                        {email}
                    </a>
                </div>
            </div>
        </div>
    );
}

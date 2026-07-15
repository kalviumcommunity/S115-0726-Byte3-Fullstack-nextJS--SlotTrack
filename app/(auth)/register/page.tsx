"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Logo from "@/app/components/navigation/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"member" | "admin">("member");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with backend authentication
    router.replace("/dashboard");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          <Logo />
        </div>
        <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-text-primary mb-1.5">
          Create account
        </h2>
        <p className="font-sans text-sm font-semibold text-text-secondary">
          Join SlotTrack to find and book your fitness classes
        </p>
      </div>

      <Card className="p-8">
        {/* Role Toggle Tabs */}
        <div className="flex p-1 bg-[#F8F8FA] rounded-input border border-border mb-6">
          <button
            type="button"
            onClick={() => {
              setRole("member");
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer select-none text-center ${
              role === "member"
                ? "bg-white text-text-primary shadow-xs border border-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Member
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("admin");
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer select-none text-center ${
              role === "admin"
                ? "bg-white text-text-primary shadow-xs border border-border"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Instructor
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {role === "admin" && (
            <Input
              label="Employee ID"
              type="text"
              id="employeeId"
              placeholder="EMP-12345"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          )}

          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" className="w-full text-base font-bold py-3">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm font-semibold text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-bold">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/app/lib/api/auth";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Logo from "@/app/components/navigation/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [role, setRole] = useState<"member" | "admin">("member");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Male");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: fullName,
        email,
        password,
        role: role.toUpperCase(),
        employeeId: role === "admin" ? employeeId : undefined,
        gender,
      });

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Account created, but auto-login failed. Please sign in manually.");
      } else {
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during registration");
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

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

          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="gender" className="text-sm font-semibold text-text-primary font-manrope">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-11 px-3.5 bg-surface border border-border rounded-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-manrope cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

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

          <Button
            type="submit"
            variant="primary"
            className="w-full text-base font-bold py-3"
            isLoading={loading}
          >
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

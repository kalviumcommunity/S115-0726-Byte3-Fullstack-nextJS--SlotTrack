"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import Logo from "@/app/components/navigation/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
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
          Welcome back
        </h2>
        <p className="font-sans text-sm font-semibold text-text-secondary">
          Login to your SlotTrack account to explore classes
        </p>
      </div>

      <Card className="p-8">
        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-between items-center text-xs font-bold text-text-secondary">
            <span className="cursor-pointer hover:text-text-primary">
              Forgot password?
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full text-base font-bold py-3"
            isLoading={loading}
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm font-semibold text-text-secondary">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-bold">
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
}

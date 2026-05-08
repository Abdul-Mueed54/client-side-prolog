"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Key } from "lucide-react";
import LoginPageLeftSide from "@/components/login/LoginPageLeftSide";
import { useAuthStore } from "@/store/useAuthStore";

export default function LandingPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  // --- UI States ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Form States ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json.message || "Invalid credentials. Please try again.",
        );
      }

      const { token, user } = json.data;

      // Save to Zustand & localStorage
      login(user, token, user.role);

      switch (user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "faculty":
          router.push("/faculty");
          break;
        case "staff":
          router.push("/staff");
          break;
        default:
          router.push("/"); // Fallback for 'unassigned' or unexpected roles
          break;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-800">
      {/* LEFT SIDE: Info & Guest Access */}
      <LoginPageLeftSide />

      {/* RIGHT SIDE: Authentication Form */}
      <div className="w-full md:w-7/12 bg-white p-8 md:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500">
              Please sign in to access your portal.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-md border border-red-100">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF9F27] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                <span>Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EF9F27] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full text-white font-bold text-sm tracking-wider uppercase py-3.5 transition-colors ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Secure login for authorized university personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}

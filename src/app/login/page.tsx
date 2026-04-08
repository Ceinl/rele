"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        window.location.href = "/categories";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void p-4">
      <div className="animate-slide-up w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/10 glow-amber">
            <BookOpen className="h-7 w-7 text-amber" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-chalk">
            Rele
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Your personal study companion
          </p>
        </div>

        <div className="card-base p-8">
          <div className="mb-6 text-center">
            <h2 className="font-display text-xl font-medium text-chalk">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {isRegister
                ? "Join to start studying"
                : "Sign in to continue learning"}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-ember/30 bg-ember/10 px-4 py-2.5 text-sm text-ember-light">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-ash"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-ash"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field"
                placeholder="your_username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-ash"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold"
            >
              {loading
                ? "..."
                : isRegister
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-sm text-muted transition-colors hover:text-amber"
            >
              {isRegister
                ? "Already have an account? Sign in"
                : "Need an account? Register"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted/60">
          Study smarter, not harder
        </p>
      </div>
    </div>
  );
}
"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.name,
            },
          },
        });

        if (error) {
          alert(error.message);
          return;
        }

        if (data.user) {
          alert(
            "Account created successfully. Please check your email if verification is required."
          );

          setMode("login");

          setForm({
            name: "",
            email: form.email,
            password: "",
          });
        }
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
          });

        if (error) {
          alert(error.message);
          return;
        }

        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <section className="relative hidden items-center justify-center border-r border-[var(--card-border)] bg-[var(--card-background)] p-12 lg:flex">
          <div className="absolute right-6 top-6">
            <ThemeToggle />
          </div>

          <div className="max-w-lg">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
                S
              </div>

              <span className="text-2xl font-bold">
                SafeText
                <span className="text-blue-500"> AI</span>
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              Stay one step ahead of digital scams.
            </h1>

            <p className="mt-6 text-base leading-8 text-[var(--muted-text)] xl:text-lg">
              Analyze suspicious messages, understand potential
              threats, and make safer decisions with AI-powered
              message intelligence.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-5">
              {[
                "AI-powered scam detection",
                "Detailed threat explanations",
                "Secure scan history",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-600 dark:bg-blue-600/15 dark:text-blue-400">
                    ✓
                  </div>

                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Security Note */}
            <div className="mt-10 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-5">
              <div className="flex gap-3">
                <span className="text-lg">🛡️</span>

                <div>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    Built with security in mind
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">
                    Your account gives you access to your own scan
                    history and security activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-10">
          <div className="w-full max-w-md">
            {/* Top Controls */}
            <div className="mb-8 flex items-center justify-between lg:justify-end">
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                  S
                </div>

                <span className="text-xl font-bold">
                  SafeText
                  <span className="text-blue-500"> AI</span>
                </span>
              </div>

              <div className="lg:hidden">
                <ThemeToggle />
              </div>
            </div>

            {/* Auth Card */}
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-6 shadow-sm sm:p-8">
              {/* Header */}
              <div className="mb-7">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  {mode === "login" ? "👋" : "🛡️"}
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  {mode === "login"
                    ? "Welcome back"
                    : "Create your account"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--muted-text)]">
                  {mode === "login"
                    ? "Sign in to continue to SafeText AI."
                    : "Create an account to start protecting yourself."}
                </p>
              </div>

              {/* Mode Switch */}
              <div className="mb-7 grid grid-cols-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                    mode === "register"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Full Name */}
                {mode === "register" && (
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter your name"
                      disabled={loading}
                      className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                      required
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    disabled={loading}
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      value={form.password}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          password: e.target.value,
                        })
                      }
                      placeholder="Enter your password"
                      disabled={loading}
                      minLength={6}
                      className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3.5 pr-20 text-sm text-[var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-[var(--muted-text)] transition hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {mode === "register" && (
                    <p className="mt-2 text-xs text-[var(--muted-text)]">
                      Password must contain at least 6 characters.
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                {mode === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Please wait...
                    </>
                  ) : mode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Terms */}
              <p className="mt-7 text-center text-xs leading-5 text-[var(--muted-text)]">
                By continuing, you agree to SafeText AI&apos;s
                terms and privacy policy.
              </p>
            </div>

            {/* Back Home */}
            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm font-medium text-[var(--muted-text)] transition hover:text-[var(--foreground)]"
              >
                ← Back to homepage
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
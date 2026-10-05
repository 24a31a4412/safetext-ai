"use client";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-600/20">
              S
            </div>

            <span className="text-xl font-bold">
              SafeText<span className="text-blue-500"> AI</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#security"
              className="transition hover:text-white"
            >
              Security
            </a>

            <a
              href="/auth"
              className="transition hover:text-white"
            >
              Login
            </a>

            <a
              href="/auth?mode=register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-white/10 px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4 text-sm text-slate-300">
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white"
              >
                How It Works
              </a>

              <a
                href="#security"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white"
              >
                Security
              </a>

              <a
                href="/auth"
                className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white"
              >
                Login
              </a>

              <a
                href="/auth?mode=register"
                className="rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white hover:bg-blue-700"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            AI-Powered Digital Safety
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-bold tracking-tight md:text-7xl">
            Detect scams before
            <span className="block text-blue-500">
              they detect you.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
            SafeText AI analyzes suspicious messages, identifies scam
            patterns, detects dangerous links, and explains why a
            message may be a threat.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/auth?mode=register"
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Start Scanning →
            </a>

            <a
              href="#how-it-works"
              className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold transition hover:bg-white/10"
            >
              Learn More
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-500">
            <span>✓ AI Analysis</span>
            <span>✓ URL Detection</span>
            <span>✓ Risk Scoring</span>
            <span>✓ Scan History</span>
          </div>

          {/* Preview */}
          <div className="mx-auto mt-20 max-w-4xl rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-left shadow-2xl shadow-blue-950/20 backdrop-blur md:p-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Live Analysis Preview
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Suspicious message detected
                </h3>
              </div>

              <span className="w-fit rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">
                HIGH RISK
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950 p-5 text-sm leading-7 text-slate-300">
              &quot;Congratulations! You have won ₹50,000. Click this
              link immediately to claim your reward.&quot;
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs text-slate-500">
                  Risk Score
                </p>

                <p className="mt-1 text-2xl font-bold text-red-400">
                  94%
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs text-slate-500">
                  Category
                </p>

                <p className="mt-1 font-semibold">
                  Prize Scam
                </p>
              </div>

              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs text-slate-500">
                  Indicators
                </p>

                <p className="mt-1 font-semibold">
                  4 detected
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 p-4">
              <span className="text-red-400">⚠</span>

              <p className="text-xs leading-5 text-slate-400">
                SafeText AI recommends verifying the sender and avoiding
                suspicious links before taking action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              AI
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Powered Analysis
            </p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              URL
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Threat Detection
            </p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-white">
              24/7
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Digital Protection
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              Powerful Protection
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              More than just scam detection
            </h2>

            <p className="mt-4 text-slate-400">
              SafeText AI combines message intelligence, risk analysis,
              URL inspection, and threat explanations in one platform.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "✦",
                title: "AI Message Analysis",
                description:
                  "Analyze messages using NLP and machine learning to identify suspicious patterns.",
              },
              {
                icon: "◈",
                title: "Risk Scoring",
                description:
                  "Get an easy-to-understand risk score and threat level for every scanned message.",
              },
              {
                icon: "⚠",
                title: "Threat Explanation",
                description:
                  "Understand exactly which indicators made the message suspicious.",
              },
              {
                icon: "🔗",
                title: "URL Analysis",
                description:
                  "Inspect links inside messages and identify suspicious URL characteristics.",
              },
              {
                icon: "🕘",
                title: "Scan History",
                description:
                  "Review previously analyzed messages and search or filter your scan history.",
              },
              {
                icon: "🛡️",
                title: "Account Protection",
                description:
                  "Authenticated accounts keep scan history separated between users.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-blue-500/20 hover:bg-white/[0.05]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-xl text-blue-400">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="border-t border-white/10 bg-slate-900/40 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              Simple Process
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              How SafeText AI works
            </h2>

            <p className="mt-4 text-slate-400">
              Three simple steps to identify suspicious messages.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              [
                "01",
                "Paste Your Message",
                "Enter the suspicious SMS, email, or social message.",
              ],
              [
                "02",
                "AI Analyzes It",
                "Our detection engine examines language, patterns, and links.",
              ],
              [
                "03",
                "Get Your Result",
                "Receive a risk score, category, explanation, and recommended action.",
              ],
            ].map(([number, title, description]) => (
              <div key={number} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold shadow-lg shadow-blue-600/20">
                  {number}
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section
        id="security"
        className="border-t border-white/10 py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                Security First
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Your scan history stays connected to your account.
              </h2>

              <p className="mt-5 leading-8 text-slate-400">
                SafeText AI uses authenticated access and user-specific
                database policies to keep scan history separated between
                accounts.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Authenticated user access",
                  "User-specific scan history",
                  "Protected database policies",
                  "Secure AI analysis workflow",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-sm text-emerald-400">
                      ✓
                    </span>

                    <span className="text-sm text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                🔒
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                Built for safer decisions
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                The goal is simple: help users pause, understand risk,
                and make safer decisions when they receive suspicious
                digital messages.
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-sm font-semibold text-emerald-300">
                  Safety reminder
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Never share OTPs, passwords, PINs, CVVs, or banking
                  credentials with anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-2xl">
            🛡️
          </div>

          <h2 className="text-3xl font-bold md:text-5xl">
            Don't trust a suspicious message.
            <span className="block text-blue-500">
              Verify it with SafeText AI.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Analyze suspicious messages, understand the risk, and make
            a more informed decision before you click or respond.
          </p>

          <a
            href="/auth?mode=register"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Create Free Account →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row md:items-center">
          <div>
            <p>© 2026 SafeText AI. All rights reserved.</p>

            <p className="mt-1 text-xs">
              AI-powered digital safety platform.
            </p>
          </div>

          <div className="flex gap-5">
            <a
              href="/auth"
              className="transition hover:text-slate-300"
            >
              Login
            </a>

            <a
              href="/auth?mode=register"
              className="transition hover:text-slate-300"
            >
              Get Started
            </a>

            <a
              href="/history"
              className="transition hover:text-slate-300"
            >
              History
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
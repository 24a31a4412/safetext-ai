"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { API_BASE_URL } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function ReportPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSuccess = status === "Scam report submitted successfully.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatus("Please enter the scam message.");
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    setStatus("");
    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  window.location.replace("/auth");
  return;
}

    try {
      const response = await fetch(`${API_BASE_URL}/api/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
  const { error: saveError } = await supabase
    .from("reports")
    .insert({
      user_id: user.id,
      message: message.trim(),
      category: data.data?.category ?? "General",
      risk_score: data.data?.risk_score ?? 0,
      prediction: data.data?.prediction ?? "SCAM",
    });

  if (saveError) {
    setStatus("Report submitted, but saving to your account failed.");
    return;
  }

  setStatus("Scam report submitted successfully.");
  setMessage("");
} else {
        setStatus(data.detail || "Failed to submit report.");
      }
    } catch {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navigation */}
      <nav className="border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
              S
            </div>

            <span className="text-lg font-bold sm:text-xl">
              SafeText<span className="text-blue-500"> AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/dashboard"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-text)] transition hover:bg-blue-500/10 hover:text-[var(--foreground)] sm:block"
            >
              Dashboard
            </a>

            <a
              href="/scanner"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-text)] transition hover:bg-blue-500/10 hover:text-[var(--foreground)] sm:block"
            >
              Scanner
            </a>

            <a
              href="/history"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-text)] transition hover:bg-blue-500/10 hover:text-[var(--foreground)] sm:block"
            >
              History
            </a>

            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-3xl">
            🚨
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
            Community Protection
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Report a Scam
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--muted-text)] sm:text-base">
            Help us identify and prevent scam messages by reporting
            suspicious messages, fake offers, or fraudulent requests.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-10 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start gap-4 rounded-xl border border-red-500/10 bg-red-500/5 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-lg">
              ⚠️
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                What should you report?
              </h2>

              <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">
                Report suspicious SMS messages, phishing attempts,
                fake prize messages, fraudulent payment requests,
                or other scam content.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="scam-message"
                className="text-sm font-semibold"
              >
                Suspicious Message
              </label>

              <span
                className={`text-xs ${
                  message.length >= 4800
                    ? "text-orange-500"
                    : "text-[var(--muted-text)]"
                }`}
              >
                {message.length} / 5000
              </span>
            </div>

            <textarea
              id="scam-message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setStatus("");
              }}
              placeholder="Paste the suspicious message here..."
              disabled={submitting}
              maxLength={5000}
              className="mt-3 min-h-[240px] w-full resize-y rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-4 text-sm leading-7 text-[var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs leading-5 text-[var(--muted-text)]">
              Do not include passwords, OTPs, bank PINs, or other
              sensitive personal information.
            </p>

            <button
              type="submit"
              disabled={!message.trim() || submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting Report...
                </>
              ) : (
                <>🚨 Report Scam</>
              )}
            </button>
          </form>

          {/* Status */}
          {status && (
            <div
              className={`mt-5 rounded-xl border p-4 ${
                isSuccess
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isSuccess
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {isSuccess ? "✓" : "!"}
                </div>

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isSuccess
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isSuccess ? "Report Submitted" : "Unable to Submit"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">
                    {status}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Safety Information */}
        <div className="mt-6 rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              🛡️
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                Stay Safe
              </h2>

              <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">
                Never send money, passwords, OTPs, or banking
                information in response to an unexpected message.
                Verify suspicious requests through an official
                channel.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/scanner"
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card-background)] px-5 py-3 text-center text-sm font-semibold text-[var(--foreground)] transition hover:bg-slate-100 dark:hover:bg-white/5"
          >
            🔍 Scan a Message
          </a>

          <a
            href="/history"
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card-background)] px-5 py-3 text-center text-sm font-semibold text-[var(--foreground)] transition hover:bg-slate-100 dark:hover:bg-white/5"
          >
            📋 View History
          </a>
        </div>
      </section>
    </main>
  );
}
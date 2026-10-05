"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

type Scan = {
  id: string;
  message: string;
  prediction: string;
  risk_score: number;
  category: string;
  explanation: string;
  created_at: string;
};

export default function HistoryPage() {
  const router = useRouter();

  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/auth");
          return;
        }

        const { data, error } = await supabase
          .from("scan_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("History error:", error);
        } else {
          setScans(data ?? []);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [router]);

  const filteredScans = useMemo(() => {
    const query = search.trim().toLowerCase();

    return scans.filter((scan) => {
      const matchesSearch =
        !query ||
        scan.message.toLowerCase().includes(query) ||
        scan.category.toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" || scan.prediction === filter;

      return matchesSearch && matchesFilter;
    });
  }, [scans, search, filter]);

  const getRiskClasses = (score: number) => {
    if (score >= 70) {
      return {
        text: "text-red-600 dark:text-red-400",
        badge:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
        bar: "bg-red-500",
      };
    }

    if (score >= 35) {
      return {
        text: "text-yellow-600 dark:text-yellow-400",
        badge:
          "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400",
        bar: "bg-yellow-500",
      };
    }

    return {
      text: "text-emerald-600 dark:text-emerald-400",
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
      bar: "bg-emerald-500",
    };
  };

  const getPredictionClasses = (prediction: string) => {
    if (prediction === "SCAM") {
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
    }

    if (prediction === "SUSPICIOUS") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400";
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
  };

  const clearFilters = () => {
    setSearch("");
    setFilter("ALL");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-20 border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
              S
            </div>

            <span className="text-lg font-bold sm:text-xl">
              SafeText<span className="text-blue-500"> AI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-5">
            <a
              href="/dashboard"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-text)] transition hover:bg-blue-500/5 hover:text-[var(--foreground)] sm:block"
            >
              Dashboard
            </a>

            <a
              href="/scanner"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-500/10 dark:text-blue-400 sm:block"
            >
              Scanner
            </a>

            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <span>🛡️</span>
            <span>Security Activity</span>
          </div>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Scan History
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-text)] sm:text-base">
                Review messages you have previously analyzed and
                quickly find suspicious activity.
              </p>
            </div>

            {!loading && scans.length > 0 && (
              <div className="flex w-fit items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-background)] px-4 py-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-semibold">
                  {scans.length}
                </span>
                <span className="text-[var(--muted-text)]">
                  total scans
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-10 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-10 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-white/20 dark:border-t-blue-500" />

            <p className="mt-5 text-sm font-medium text-[var(--muted-text)]">
              Loading scan history...
            </p>
          </div>
        ) : scans.length === 0 ? (
          /* No scans */
          <div className="mt-10 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
              🔍
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No scans yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted-text)]">
              Analyze your first suspicious message and your scan
              results will appear here.
            </p>

            <a
              href="/scanner"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Start Scanning →
            </a>
          </div>
        ) : (
          <>
            {/* Search + Filter */}
            <div className="mt-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search messages or categories..."
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] py-3 pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 text-sm font-medium text-[var(--foreground)] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                >
                  <option value="ALL">All Scans</option>
                  <option value="SCAM">Scams</option>
                  <option value="SUSPICIOUS">Suspicious</option>
                  <option value="LIKELY SAFE">Safe</option>
                </select>
              </div>

              {/* Result Count */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[var(--muted-text)]">
                  Showing{" "}
                  <span className="font-bold text-[var(--foreground)]">
                    {filteredScans.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[var(--foreground)]">
                    {scans.length}
                  </span>{" "}
                  scans
                </p>

                {(search || filter !== "ALL") && (
                  <button
                    onClick={clearFilters}
                    className="rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-500/10 dark:text-blue-400"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* No matching scans */}
            {filteredScans.length === 0 && (
              <div className="mt-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-10 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-white/5">
                  🔎
                </div>

                <h2 className="mt-5 font-semibold">
                  No matching scans found
                </h2>

                <p className="mt-2 text-sm text-[var(--muted-text)]">
                  Try a different search term or filter.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-xl border border-[var(--card-border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Scan List */}
            {filteredScans.length > 0 && (
              <div className="mt-6 space-y-4">
                {filteredScans.map((scan) => {
                  const riskClasses = getRiskClasses(scan.risk_score);

                  return (
                    <div
                      key={scan.id}
                      className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        {/* Message */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />

                            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-text)]">
                              Scanned Message
                            </span>
                          </div>

                          <p className="line-clamp-3 text-sm leading-7 text-[var(--foreground)]">
                            {scan.message}
                          </p>

                          {/* Metadata */}
                          <div className="mt-5 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                              {scan.category}
                            </span>

                            <span className="rounded-full border border-[var(--card-border)] bg-slate-50 px-3 py-1.5 text-xs text-[var(--muted-text)] dark:bg-white/5">
                              {new Date(
                                scan.created_at
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Risk */}
                        <div className="flex items-center justify-between gap-5 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-4 md:min-w-[220px] md:justify-end md:bg-transparent md:p-0 dark:md:bg-transparent">
                          <div className="min-w-[75px] text-left md:text-right">
                            <p className="text-xs font-medium text-[var(--muted-text)]">
                              Risk Score
                            </p>

                            <p
                              className={`mt-1 text-2xl font-bold ${riskClasses.text}`}
                            >
                              {scan.risk_score}%
                            </p>
                          </div>

                          <span
                            className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getPredictionClasses(
                              scan.prediction
                            )}`}
                          >
                            {scan.prediction}
                          </span>
                        </div>
                      </div>

                      {/* Risk Bar */}
                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs text-[var(--muted-text)]">
                            Risk level
                          </span>

                          <span
                            className={`text-xs font-semibold ${riskClasses.text}`}
                          >
                            {scan.risk_score >= 70
                              ? "High"
                              : scan.risk_score >= 35
                                ? "Medium"
                                : "Low"}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all ${riskClasses.bar}`}
                            style={{
                              width: `${Math.min(
                                Math.max(scan.risk_score, 0),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Explanation */}
                      {scan.explanation && (
                        <div className="mt-6 border-t border-[var(--card-border)] pt-5">
                          <div className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-sm">
                              💡
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-[var(--foreground)]">
                                AI Explanation
                              </p>

                              <p className="mt-1 text-sm leading-6 text-[var(--muted-text)]">
                                {scan.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
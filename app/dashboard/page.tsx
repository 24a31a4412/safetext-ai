"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ScamMap from "./ScamMap";
import { API_BASE_URL } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

type DashboardStats = {
  totalScans: number;
  scamsDetected: number;
  suspiciousDetected: number;
  safeDetected: number;
  averageRisk: number;
};

type RecentScan = {
  prediction: string;
  risk_score: number;
  category: string;
  created_at: string;
};

type HeatmapItem = {
  state: string;
  scams: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    scamsDetected: 0,
    suspiciousDetected: 0,
    safeDetected: 0,
    averageRisk: 0,
  });

  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapItem[]>([]);

  const [trendData, setTrendData] = useState<{
    total_scans: number;
    scam_messages: number;
    safe_messages: number;
    average_risk_score: number;
    daily_scans: { date: string; scans: number }[];
  } | null>(null);

  const [seniorMode, setSeniorMode] = useState(false);

  // Load Heat Map
  useEffect(() => {
    const loadHeatmap = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/heatmap`
        );

        if (!response.ok) {
          throw new Error("Heat map API failed");
        }

        const data = await response.json();

        if (data.success) {
          setHeatmapData(data.data);
        }
      } catch (error) {
        console.error("Heat map error:", error);
      }
    };

    loadHeatmap();
  }, []);

  // Load Trends
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/trends`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTrendData(data.data);
        }
      })
      .catch((error) => {
        console.error("Trends error:", error);
      });
  }, []);

  // Load Dashboard
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/auth");
          return;
        }

        setEmail(user.email ?? "");

        const { data: scans, error } = await supabase
          .from("scan_history")
          .select(
            "prediction, risk_score, category, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Dashboard stats error:", error);
          return;
        }

        const scanData = scans ?? [];

        setRecentScans(scanData.slice(0, 5));

        const totalScans = scanData.length;

        const scamsDetected = scanData.filter(
          (scan) => scan.prediction === "SCAM"
        ).length;

        const suspiciousDetected = scanData.filter(
          (scan) => scan.prediction === "SUSPICIOUS"
        ).length;

        const safeDetected = scanData.filter(
          (scan) =>
            scan.prediction === "LIKELY SAFE" ||
            scan.prediction === "SAFE"
        ).length;

        const averageRisk =
          totalScans > 0
            ? Math.round(
                scanData.reduce(
                  (total, scan) =>
                    total + (scan.risk_score ?? 0),
                  0
                ) / totalScans
              )
            : 0;

        setStats({
          totalScans,
          scamsDetected,
          suspiciousDetected,
          safeDetected,
          averageRisk,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  return (
    <main
      className={`min-h-screen bg-[var(--background)] text-[var(--foreground)] ${
        seniorMode ? "senior-mode" : ""
      }`}
    >
      {/* Navigation */}
<nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-950/95">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
        S
      </div>

      <span
        className={`font-bold text-slate-900 dark:text-white ${
          seniorMode ? "text-2xl" : "text-xl"
        }`}
      >
        SafeText
        <span className="text-blue-600 dark:text-blue-400"> AI</span>
      </span>
    </div>

    {/* Navigation Links */}
    <div className="flex items-center gap-2">
      {seniorMode ? (
        <>
          <a
            href="/scanner"
            className="hidden rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-400 dark:hover:bg-blue-500/10 sm:block"
          >
            🔍 Scanner
          </a>

          <a
            href="/report"
            className="hidden rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400 dark:hover:bg-red-500/10 sm:block"
          >
            🚨 Report Scam
          </a>

          <a
            href="/history"
            className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 sm:block"
          >
            📋 History
          </a>
        </>
      ) : (
        <>
          <a
            href="/scanner"
            className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white sm:block"
          >
            Scanner
          </a>

          <a
            href="/history"
            className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white sm:block"
          >
            History
          </a>

          <a
            href="/report"
            className="hidden rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400 dark:hover:bg-red-500/10 sm:block"
          >
            Report Scam
          </a>
        </>
      )}

      {/* Theme */}
      <ThemeToggle />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={`rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 ${
          seniorMode
            ? "min-h-[52px] px-5 py-3 text-base"
            : "text-sm"
        }`}
      >
        Logout
      </button>
    </div>
  </div>
</nav>


      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* Senior Citizen Mode */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              className={`font-semibold ${
                seniorMode ? "text-2xl" : "text-lg"
              }`}
            >
              Senior Citizen Mode 👴👵
            </h2>

            <p
              className={`mt-1 text-[var(--muted-text)] ${
                seniorMode ? "text-base" : "text-sm"
              }`}
            >
              Larger text and simpler interface
            </p>
          </div>

          <button
            onClick={() => setSeniorMode(!seniorMode)}
            className={`rounded-full px-6 py-3 font-bold transition ${
              seniorMode
                ? "bg-green-500 text-slate-900 dark:text-white"
                : "bg-slate-700 text-slate-700 dark:text-slate-200"
            } ${seniorMode ? "text-lg" : "text-sm"}`}
          >
            {seniorMode ? "ON" : "OFF"}
          </button>
        </div>

        {seniorMode && (
          <div className="mt-8 space-y-6">

            {/* Senior Mode Header */}
            <div className="rounded-2xl border-2 border-blue-500/20 bg-blue-500/5 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                  👴
                </div>

                <div>
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Senior Safety Mode
                  </h2>

                  <p className="mt-2 text-base leading-7 text-[var(--muted-text)]">
                    Simple tools to help you stay safe from scams.
                  </p>
                </div>
              </div>
            </div>

            {/* Protection Status */}
            <div className="rounded-2xl border-2 border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
                  🛡️
                </div>

                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    You are protected
                  </h2>

                  <p className="mt-1 text-base leading-7 text-[var(--muted-text)]">
                    SafeText AI protection is active.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Actions */}
            <div className="grid gap-6 sm:grid-cols-2">

              {/* Scan */}
              <div className="rounded-2xl border-2 border-blue-500/20 bg-blue-500/5 p-6 sm:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                  🔍
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Check a Message
                </h2>

                <p className="mt-2 text-base leading-7 text-[var(--muted-text)]">
                  Got a suspicious SMS, WhatsApp message, email, or link?
                  Let SafeText AI check it for you.
                </p>

                <a
                  href="/scanner"
                  className="mt-6 flex min-h-[58px] items-center justify-center rounded-xl bg-blue-600 px-6 text-lg font-bold text-slate-900 dark:text-white transition hover:bg-blue-700"
                >
                  🔍 Check Message
                </a>
              </div>

              {/* Report */}
              <div className="rounded-2xl border-2 border-red-500/20 bg-red-500/5 p-6 sm:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
                  🚨
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Report a Scam
                </h2>

                <p className="mt-2 text-base leading-7 text-[var(--muted-text)]">
                  Received a scam message? Report it to help protect
                  other people.
                </p>

                <a
                  href="/report"
                  className="mt-6 flex min-h-[58px] items-center justify-center rounded-xl bg-red-600 px-6 text-lg font-bold text-slate-900 dark:text-white transition hover:bg-red-700"
                >
                  🚨 Report Scam
                </a>
              </div>
            </div>

            {/* Recent Checks */}
            <div className="rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-background)] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    📋 Recent Checks
                  </h2>

                  <p className="mt-1 text-base text-[var(--muted-text)]">
                    Your recently checked messages.
                  </p>
                </div>

                <a
                  href="/history"
                  className="hidden rounded-xl border border-[var(--card-border)] px-4 py-3 text-base font-semibold hover:bg-blue-500/10 sm:block"
                >
                  View All
                </a>
              </div>

              {loading ? (
                <div className="mt-6 rounded-xl border border-[var(--card-border)] p-6 text-center">
                  <p className="text-base text-[var(--muted-text)]">
                    Loading your checks...
                  </p>
                </div>
              ) : recentScans.length === 0 ? (
                <div className="mt-6 rounded-xl border border-[var(--card-border)] p-6 text-center">
                  <p className="text-base text-[var(--muted-text)]">
                    You have not checked any messages yet.
                  </p>

                  <a
                    href="/scanner"
                    className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-blue-600 px-6 text-base font-bold text-slate-900 dark:text-white"
                  >
                    🔍 Check Your First Message
                  </a>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {recentScans.slice(0, 3).map((scan, index) => (
                    <div
                      key={`${scan.created_at}-${index}`}
                      className="flex flex-col gap-4 rounded-xl border-2 border-[var(--card-border)] bg-[var(--background)] p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold">
                          {scan.category}
                        </p>

                        <p className="mt-1 text-sm text-[var(--muted-text)]">
                          {new Date(scan.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-bold ${
                            scan.prediction === "SCAM"
                              ? "bg-red-500/10 text-red-500"
                              : scan.prediction === "SUSPICIOUS"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {scan.prediction}
                        </span>

                        <span className="text-lg font-bold">
                          {scan.risk_score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <a
                href="/history"
                className="mt-5 flex min-h-[52px] items-center justify-center rounded-xl border-2 border-[var(--card-border)] px-6 text-base font-bold sm:hidden"
              >
                📋 View All History
              </a>
            </div>

            {/* Simple Safety Tips */}
            <div className="rounded-2xl border-2 border-orange-500/20 bg-orange-500/5 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl">
                  ⚠️
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Stay Safe
                  </h2>

                  <div className="mt-5 space-y-4 text-base leading-7">
                    <p>
                      🔐 <strong>Never share</strong> your OTP, PIN, password,
                      or banking details.
                    </p>

                    <p>
                      🔗 <strong>Do not open</strong> suspicious links sent
                      by unknown people.
                    </p>

                    <p>
                      💰 <strong>Never send money</strong> because someone
                      pressures you urgently.
                    </p>

                    <p>
                      📞 <strong>Verify first</strong> if someone claims to
                      be from your bank or a government office.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {!seniorMode && (
          <>
        {/* Welcome */}
        <p
          className={`text-[var(--muted-text)] ${
            seniorMode ? "text-base" : "text-sm"
          }`}
        >
          Welcome back
        </p>

        <h1
          className={`mt-2 font-bold ${
            seniorMode ? "text-5xl" : "text-4xl"
          }`}
        >
          SafeText AI Dashboard
        </h1>

        <p
          className={`mt-3 text-[var(--muted-text)] ${
            seniorMode ? "text-base" : ""
          }`}
        >
          Signed in as {email}
        </p>

        {/* Stats */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Scans */}
          <div className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.03] p-6">
            <p className={seniorMode ? "text-base" : "text-sm"}>
              Total Scans
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {loading ? "..." : stats.totalScans}
            </p>

            <p className="mt-2 text-xs text-[var(--muted-text)]">
              Messages analyzed
            </p>
          </div>

          {/* Scam Count */}
          <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-6">
            <p className={seniorMode ? "text-base" : "text-sm"}>
              Scams Detected
            </p>

            <p className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">
              {loading ? "..." : stats.scamsDetected}
            </p>

            <p className="mt-2 text-xs text-[var(--muted-text)]">
              High-risk messages
            </p>
          </div>

          {/* Suspicious Count */}
          <div className="rounded-2xl border border-yellow-500/10 bg-yellow-500/[0.03] p-6">
            <p className={seniorMode ? "text-base" : "text-sm"}>
              Suspicious
            </p>

            <p className="mt-3 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {loading ? "..." : stats.suspiciousDetected}
            </p>

            <p className="mt-2 text-xs text-[var(--muted-text)]">
              Messages needing caution
            </p>
          </div>

          {/* Average Risk */}
          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6">
            <p className={seniorMode ? "text-base" : "text-sm"}>
              Average Risk
            </p>

            <p className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {loading ? "..." : `${stats.averageRisk}%`}
            </p>

            <p className="mt-2 text-xs text-[var(--muted-text)]">
              Across your scans
            </p>
          </div>
        </div>

        {/* Protection Status */}
        <div
          className={`mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 ${
            seniorMode ? "senior-important" : ""
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">
                🛡️
              </div>

              <div>
                <h2 className="font-semibold">
                  Protection Status
                </h2>

                <p
                  className={`mt-1 text-[var(--muted-text)] ${
                    seniorMode ? "text-base" : "text-sm"
                  }`}
                >
                  SafeText AI protection is active for your account.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>
        </div>

        {/* Scanner CTA */}
        <div
          className={`mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 ${
            seniorMode ? "senior-important" : ""
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
            🔍
          </div>

          <h2
            className={`mt-5 font-bold ${
              seniorMode ? "text-3xl" : "text-2xl"
            }`}
          >
            {seniorMode
              ? "Check a Suspicious Message"
              : "Scan a suspicious message"}
          </h2>

          <p
            className={`mt-2 max-w-2xl text-[var(--muted-text)] ${
              seniorMode ? "text-lg leading-8" : ""
            }`}
          >
            {seniorMode
              ? "Paste a suspicious SMS, email, or message here. SafeText AI will check it for scam warning signs."
              : "Paste an SMS, email, social media message, or suspicious text and let SafeText AI analyze potential scam indicators."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/scanner"
              className={`rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold hover:bg-blue-700 ${
                seniorMode ? "py-5 text-xl" : ""
              }`}
            >
              {seniorMode
                ? "🔍 Check Message"
                : "Start Scanning →"}
            </a>

            <a
              href="/history"
              className={`rounded-xl border border-[var(--card-border)] px-6 py-3 text-center font-semibold text-slate-700 dark:text-slate-300 hover:bg-[var(--card-background)] hover:text-slate-900 dark:text-white ${
                seniorMode ? "py-5 text-xl" : ""
              }`}
            >
              {seniorMode
                ? "📋 My Scan History"
                : "View Scan History →"}
            </a>
          </div>
        </div>

        {/* Report Scam CTA */}
        <div
          className={`mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 ${
            seniorMode ? "senior-important" : ""
          }`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-xl">
                🚨
              </div>

              <h2
                className={`mt-5 font-bold ${
                  seniorMode ? "text-3xl" : "text-2xl"
                }`}
              >
                {seniorMode ? "Report a Scam" : "Report a Scam 🚨"}
              </h2>

              <p
                className={`mt-2 max-w-2xl text-[var(--muted-text)] ${
                  seniorMode ? "text-lg leading-8" : ""
                }`}
              >
                Help protect others by reporting suspicious messages,
                scam attempts, fake offers, or fraudulent activity.
              </p>
            </div>

            <a
              href="/report"
              className={`inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-center font-semibold text-slate-900 dark:text-white transition hover:bg-red-700 ${
                seniorMode
                  ? "min-h-[56px] w-full text-xl sm:w-auto sm:px-8"
                  : ""
              }`}
            >
              🚨 Report Scam →
            </a>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Security Summary */}
          <div
            className={`rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-6 ${
              seniorMode ? "senior-important" : ""
            }`}
          >
            <h3
              className={`font-semibold ${
                seniorMode ? "text-xl" : "text-lg"
              }`}
            >
              Your Security Summary
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex items-center justify-between">
                <span
                  className={
                    seniorMode
                      ? "text-base text-[var(--muted-text)]"
                      : "text-sm text-[var(--muted-text)]"
                  }
                >
                  Safe messages
                </span>

                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {loading ? "..." : stats.safeDetected}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={
                    seniorMode
                      ? "text-base text-[var(--muted-text)]"
                      : "text-sm text-[var(--muted-text)]"
                  }
                >
                  Suspicious messages
                </span>

                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {loading ? "..." : stats.suspiciousDetected}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={
                    seniorMode
                      ? "text-base text-[var(--muted-text)]"
                      : "text-sm text-[var(--muted-text)]"
                  }
                >
                  Scam messages
                </span>

                <span className="font-semibold text-red-600 dark:text-red-400">
                  {loading ? "..." : stats.scamsDetected}
                </span>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          <div
            className={`rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-6 ${
              seniorMode ? "senior-important" : ""
            }`}
          >
            <h3
              className={`font-semibold ${
                seniorMode ? "text-xl" : "text-lg"
              }`}
            >
              Stay Protected
            </h3>

            <div
              className={`mt-5 space-y-3 leading-6 text-[var(--muted-text)] ${
                seniorMode
                  ? "text-base leading-7"
                  : "text-sm"
              }`}
            >
              <p>
                • Never share OTPs or passwords with unknown contacts.
              </p>

              <p>
                • Verify suspicious links before opening them.
              </p>

              <p>
                • Be careful with urgent payment requests.
              </p>

              <p>
                • Verify unexpected prize and job offers independently.
              </p>
            </div>
          </div>
        </div>

        {/* Scam Heat Map */}
        <div
          className={`mt-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-6 md:p-8 ${
            seniorMode ? "senior-important" : ""
          }`}
        >
          <div>
            <h2
              className={`font-bold ${
                seniorMode ? "text-2xl" : "text-xl"
              }`}
            >
              Scam Heat Map 🗺️
            </h2>

            <p
              className={`mt-1 text-[var(--muted-text)] ${
                seniorMode ? "text-base" : "text-sm"
              }`}
            >
              Reported scam activity by state
            </p>
          </div>

          {heatmapData.length === 0 ? (
            <div className="mt-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-6 text-center">
              <p className="text-sm text-[var(--muted-text)]">
                Loading heat map...
              </p>
            </div>
          ) : (
            <ScamMap data={heatmapData} />
          )}
        </div>

        {/* Scam Trends */}
        {trendData && (
          <div
            className={`mt-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-6 ${
              seniorMode ? "senior-important" : ""
            }`}
          >
            <h2
              className={`font-semibold ${
                seniorMode ? "text-2xl" : "text-xl"
              }`}
            >
              Scam Trends 📈
            </h2>

            <p
              className={`mt-1 text-[var(--muted-text)] ${
                seniorMode ? "text-base" : "text-sm"
              }`}
            >
              Scam detection activity overview
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl border border-[var(--card-border)] bg-slate-100 dark:bg-black/20 p-5">
                <p className="text-xs text-[var(--muted-text)]">
                  Total Scans
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {trendData.total_scans}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--card-border)] bg-slate-100 dark:bg-black/20 p-5">
                <p className="text-xs text-[var(--muted-text)]">
                  Scam Messages
                </p>

                <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                  {trendData.scam_messages}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--card-border)] bg-slate-100 dark:bg-black/20 p-5">
                <p className="text-xs text-[var(--muted-text)]">
                  Safe Messages
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                  {trendData.safe_messages}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--card-border)] bg-slate-100 dark:bg-black/20 p-5">
                <p className="text-xs text-[var(--muted-text)]">
                  Average Risk Score
                </p>

                <p className="mt-2 text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {trendData.average_risk_score}%
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                Daily Scans
              </p>

              <div className="flex items-end gap-3">
                {trendData.daily_scans.map((item) => (
                  <div
                    key={item.date}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t-lg bg-red-500/70"
                      style={{
                        height: `${Math.max(
                          item.scans * 2,
                          20
                        )}px`,
                      }}
                    />

                    <span className="text-xs text-[var(--muted-text)]">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Analytics */}
        <div
          className={`mt-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-6 md:p-8 ${
            seniorMode ? "senior-important" : ""
          }`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                className={`font-bold ${
                  seniorMode ? "text-2xl" : "text-xl"
                }`}
              >
                Security Analytics
              </h2>

              <p
                className={`mt-1 text-[var(--muted-text)] ${
                  seniorMode ? "text-base" : "text-sm"
                }`}
              >
                Overview of your recent message analysis activity.
              </p>
            </div>

            <a
              href="/history"
              className={`font-medium text-blue-600 dark:text-blue-400 hover:text-blue-300 ${
                seniorMode ? "text-base" : "text-sm"
              }`}
            >
              View all scans →
            </a>
          </div>

          {loading ? (
            <div className="mt-8 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-8 text-center">
              <p className="text-sm text-[var(--muted-text)]">
                Loading analytics...
              </p>
            </div>
          ) : recentScans.length === 0 ? (
            <div className="mt-8 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-8 text-center">
              <p className="text-sm text-[var(--muted-text)]">
                No scan activity yet.
              </p>

              <a
                href="/scanner"
                className={`mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-semibold hover:bg-blue-700 ${
                  seniorMode ? "text-lg" : "text-sm"
                }`}
              >
                Analyze your first message
              </a>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {recentScans.map((scan, index) => (
                <div
                  key={`${scan.created_at}-${index}`}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p
                      className={`font-medium text-slate-700 dark:text-slate-300 ${
                        seniorMode ? "text-base" : "text-sm"
                      }`}
                    >
                      {scan.category}
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted-text)]">
                      {new Date(
                        scan.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        scan.prediction === "SCAM"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : scan.prediction === "SUSPICIOUS"
                            ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {scan.prediction}
                    </span>

                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {scan.risk_score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </>
        )}

      </section>
    </main>
  );
}
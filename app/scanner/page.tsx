"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { API_BASE_URL } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

type ScanResult = {
  prediction: string;
  risk_score: number;
  category: string;
  language: string;
  indicators: string[];
  explanation: string[];
  links_detected: number;
  url_analysis: {
    url: string;
    domain: string;
    risk_score: number;
    risk_level: string;
    indicators: string[];
  }[];
};

export default function ScannerPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.replace("/auth");
          return;
        }

        setAuthChecking(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
        window.location.replace("/auth");
      }
    };

    checkAuth();
  }, []);

  const handleAnalyze = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/scanner/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed.");
      }

      const analysisResult = data.data;

      setResult(analysisResult);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.replace("/auth");
        return;
      }

      const { error: saveError } = await supabase
        .from("scan_history")
        .insert({
          user_id: user.id,
          message: message.trim(),
          prediction: analysisResult.prediction,
          risk_score: analysisResult.risk_score,
          category: analysisResult.category,
          explanation: analysisResult.explanation.join(" "),
        });

      if (saveError) {
        console.error("Failed to save scan:", saveError);

        setSuccessMessage(
          "Scan completed, but saving to history failed."
        );
      } else {
        setSuccessMessage(
          "Scan completed and saved to your history."
        );
      }
    } catch (error) {
      console.error("Scanner error:", error);

      setResult(null);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to analyze the message. Please make sure the SafeText AI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setResult(null);
    setError("");
    setSuccessMessage("");
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return "VERY HIGH";
    if (score >= 50) return "HIGH";
    if (score >= 35) return "MEDIUM";
    return "LOW";
  };

  const getRiskClasses = (score: number) => {
    if (score >= 70) {
      return {
        badge:
          "bg-red-500/10 text-red-400 border-red-500/20",
        bar: "bg-red-500",
        text: "text-red-400",
      };
    }

    if (score >= 50) {
      return {
        badge:
          "bg-orange-500/10 text-orange-400 border-orange-500/20",
        bar: "bg-orange-500",
        text: "text-orange-400",
      };
    }

    if (score >= 35) {
      return {
        badge:
          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        bar: "bg-yellow-500",
        text: "text-yellow-400",
      };
    }

    return {
      badge:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      bar: "bg-emerald-500",
      text: "text-emerald-400",
    };
  };

  const getUrlRiskClasses = (score: number) => {
    if (score >= 60) {
      return {
        badge:
          "bg-red-500/10 text-red-400 border-red-500/20",
        bar: "bg-red-500",
      };
    }

    if (score >= 30) {
      return {
        badge:
          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        bar: "bg-yellow-500",
      };
    }

    return {
      badge:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      bar: "bg-emerald-500",
    };
  };

  if (authChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300/30 border-t-blue-500" />

          <p className="mt-4 text-sm text-[var(--muted-text)]">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  const riskClasses = result
    ? getRiskClasses(result.risk_score)
    : null;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <nav className="border-b border-[var(--card-border)] bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              S
            </div>

            <span className="text-xl font-bold">
              SafeText<span className="text-blue-500"> AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/history"
              className="hidden text-sm text-[var(--muted-text)] transition hover:text-[var(--foreground)] sm:block"
            >
              History
            </a>

            <a
              href="/dashboard"
              className="hidden text-sm text-[var(--muted-text)] transition hover:text-[var(--foreground)] sm:block"
            >
              ← Dashboard
            </a>

            <ThemeToggle />
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-2xl text-blue-400">
            🛡️
          </div>

          <h1 className="text-4xl font-bold md:text-5xl">
            Scam Message Scanner
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted-text)]">
            Paste a suspicious SMS, email, social media message, or
            other text below. SafeText AI will analyze it for potential
            scam indicators.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)] p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[var(--foreground)]">
              Message to analyze
            </label>

            <span
              className={`text-xs ${
                message.length >= 4800
                  ? "text-orange-400"
                  : "text-[var(--muted-text)]"
              }`}
            >
              {message.length} / 5000 characters
            </span>
          </div>

          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setResult(null);
              setError("");
              setSuccessMessage("");
            }}
            disabled={loading}
            placeholder="Paste the suspicious message here..."
            className="mt-4 min-h-[260px] w-full resize-none rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-5 text-sm leading-7 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-text)] focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            maxLength={5000}
          />

          {/* Screenshot Scanner */}
          <div className="mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              📸 Scan Screenshot
            </h3>

            <p className="mt-1 text-xs text-[var(--muted-text)]">
              Upload a screenshot of a suspicious message.
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setLoading(true);
                setResult(null);
                setError("");
                setSuccessMessage("");

                try {
                  const formData = new FormData();
                  formData.append("file", file);

                  const response = await fetch(
                    `${API_BASE_URL}/api/screenshot/analyze`,
                    {
                      method: "POST",
                      body: formData,
                    }
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(
                      data.detail ||
                        "Screenshot analysis failed."
                    );
                  }

                  setMessage(data.data.extracted_text);
                  setResult(data.data.analysis);

                  setSuccessMessage(
                    "Screenshot scanned successfully."
                  );
                } catch (error) {
                  setError(
                    error instanceof Error
                      ? error.message
                      : "Screenshot analysis failed."
                  );
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="mt-4 block w-full cursor-pointer rounded-xl border border-[var(--card-border)] bg-[var(--card-background)] p-3 text-sm text-[var(--muted-text)]"
            />
          </div>

          {/* Voice Scanner */}
          <div className="mt-4 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              🎤 Scan Voice
            </h3>

            <p className="mt-1 text-xs text-[var(--muted-text)]">
              Upload a voice recording of a suspicious call or message.
            </p>

            <input
              type="file"
              accept="audio/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setLoading(true);
                setResult(null);
                setError("");
                setSuccessMessage("");

                try {
                  const formData = new FormData();
                  formData.append("file", file);

                  const response = await fetch(
                    `${API_BASE_URL}/api/voice/analyze`,
                    {
                      method: "POST",
                      body: formData,
                    }
                  );

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(
                      data.detail || "Voice analysis failed."
                    );
                  }

                  setMessage(data.data.transcribed_text);
                  setResult(data.data.analysis);

                  setSuccessMessage(
                    "Voice recording analyzed successfully."
                  );
                } catch (error) {
                  setError(
                    error instanceof Error
                      ? error.message
                      : "Voice analysis failed."
                  );
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="mt-4 block w-full cursor-pointer rounded-xl border border-[var(--card-border)] bg-[var(--card-background)] p-3 text-sm text-[var(--muted-text)]"
            />
          </div>

          {message.length >= 4800 && (
            <p className="mt-2 text-xs text-orange-400">
              You are close to the 5000 character limit.
            </p>
          )}

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-[var(--muted-text)]">
              Do not share passwords, OTPs, bank details, or other
              sensitive personal information.
            </p>

            <div className="flex gap-3">
              {message && !loading && (
                <button
                  onClick={handleClear}
                  className="rounded-xl border border-[var(--card-border)] px-5 py-3.5 text-sm font-semibold text-[var(--muted-text)] transition hover:bg-[var(--card-background)] hover:text-[var(--foreground)]"
                >
                  Clear
                </button>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!message.trim() || loading}
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Message →"
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-400">
                    Analysis failed
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-400/80">
                    {error}
                  </p>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!message.trim() || loading}
                  className="w-fit rounded-lg border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {successMessage && result && (
          <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                ✓
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-400">
                  Scan completed
                </p>

                <p className="mt-1 text-xs text-[var(--muted-text)]">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {result && riskClasses && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-background)]">
            <div className="border-b border-[var(--card-border)] p-6 md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-[var(--muted-text)]">
                    AI Analysis Result
                  </p>

                  <h2
                    className={`mt-1 text-3xl font-bold ${riskClasses.text}`}
                  >
                    {result.prediction}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--muted-text)]">
                    {result.category}
                  </p>
                </div>

                <div
                  className={`rounded-full border px-5 py-2.5 text-sm font-bold ${riskClasses.badge}`}
                >
                  {getRiskLabel(result.risk_score)} RISK
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-[var(--muted-text)]">
                      Risk Meter
                    </p>

                    <p className="mt-1 text-xs text-[var(--muted-text)]">
                      Based on detected scam signals and URL risk
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-3xl font-bold ${riskClasses.text}`}
                    >
                      {result.risk_score}%
                    </span>

                    <p
                      className={`mt-1 text-xs font-semibold ${riskClasses.text}`}
                    >
                      {getRiskLabel(result.risk_score)} RISK
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${riskClasses.bar}`}
                      style={{
                        width: `${result.risk_score}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-[10px] text-[var(--muted-text)]">
                    <span>SAFE</span>
                    <span>MEDIUM</span>
                    <span>HIGH</span>
                    <span>VERY HIGH</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-4">
                  <p
                    className={`text-sm font-semibold ${riskClasses.text}`}
                  >
                    {result.risk_score >= 70
                      ? "High danger — avoid interacting with this message."
                      : result.risk_score >= 50
                        ? "High caution — verify the sender before taking any action."
                        : result.risk_score >= 35
                          ? "Be careful — some suspicious signals were detected."
                          : "Low risk — no major scam signals were detected."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid border-b border-[var(--card-border)] sm:grid-cols-4">
              <div className="border-b border-[var(--card-border)] p-6 sm:border-b-0 sm:border-r">
                <p className="text-xs text-[var(--muted-text)]">
                  Risk Score
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${riskClasses.text}`}
                >
                  {result.risk_score}%
                </p>
              </div>

              <div className="border-b border-[var(--card-border)] p-6 sm:border-b-0 sm:border-r">
                <p className="text-xs text-[var(--muted-text)]">
                  Scam Category
                </p>

                <p className="mt-2 font-semibold">
                  {result.category}
                </p>
              </div>

              <div className="border-b border-[var(--card-border)] p-6 sm:border-b-0 sm:border-r">
                <p className="text-xs text-[var(--muted-text)]">
                  Language
                </p>

                <p className="mt-2 font-semibold">
                  {result.language}
                </p>
              </div>

              <div className="p-6">
                <p className="text-xs text-[var(--muted-text)]">
                  URLs Detected
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {result.links_detected}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-lg font-semibold">
                Detected Indicators
              </h3>

              <p className="mt-1 text-sm text-[var(--muted-text)]">
                Signals identified by the SafeText AI detection engine.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {result.indicators.length > 0 ? (
                  result.indicators.map((indicator) => (
                    <span
                      key={indicator}
                      className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium capitalize text-blue-500 dark:text-blue-300"
                    >
                      {indicator.replaceAll("_", " ")}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[var(--muted-text)]">
                    No major scam indicators detected.
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-[var(--card-border)] p-6 md:p-8">
              <h3 className="text-lg font-semibold">
                Why was this message flagged?
              </h3>

              <div className="mt-5 space-y-3">
                {result.explanation.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-sm text-yellow-500 dark:text-yellow-400">
                      !
                    </div>

                    <p className="text-sm leading-6 text-[var(--muted-text)]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {result.url_analysis &&
              result.url_analysis.length > 0 && (
                <div className="border-t border-[var(--card-border)] p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        🔗 URL Security Analysis
                      </h3>

                      <p className="mt-1 text-sm text-[var(--muted-text)]">
                        Security signals detected in the links found
                        in this message.
                      </p>
                    </div>

                    <span className="hidden rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-500 dark:text-blue-300 sm:block">
                      {result.url_analysis.length} URL
                      {result.url_analysis.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {result.url_analysis.map((urlInfo, index) => {
                      const urlRiskClasses =
                        getUrlRiskClasses(urlInfo.risk_score);

                      return (
                        <div
                          key={`${urlInfo.url}-${index}`}
                          className="rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-5"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-xs text-[var(--muted-text)]">
                                Detected URL
                              </p>

                              <p className="mt-1 break-all text-sm">
                                {urlInfo.url}
                              </p>

                              <p className="mt-2 break-all text-xs text-[var(--muted-text)]">
                                Domain: {urlInfo.domain}
                              </p>
                            </div>

                            <span
                              className={`w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${urlRiskClasses.badge}`}
                            >
                              {urlInfo.risk_level} RISK
                            </span>
                          </div>

                          <div className="mt-5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[var(--muted-text)]">
                                URL Risk Score
                              </span>

                              <span className="font-semibold">
                                {urlInfo.risk_score}%
                              </span>
                            </div>

                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${urlRiskClasses.bar}`}
                                style={{
                                  width: `${urlInfo.risk_score}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="mt-5">
                            <p className="text-xs font-semibold">
                              URL Indicators
                            </p>

                            <div className="mt-3 space-y-2">
                              {urlInfo.indicators.length > 0 ? (
                                urlInfo.indicators.map(
                                  (indicator, indicatorIndex) => (
                                    <div
                                      key={`${indicator}-${indicatorIndex}`}
                                      className="flex gap-2 text-sm text-[var(--muted-text)]"
                                    >
                                      <span className="text-yellow-500 dark:text-yellow-400">
                                        ⚠
                                      </span>

                                      <span>{indicator}</span>
                                    </div>
                                  )
                                )
                              ) : (
                                <p className="text-sm text-[var(--muted-text)]">
                                  No specific URL indicators reported.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 rounded-lg border border-red-500/10 bg-red-500/5 p-4">
                            <p className="text-xs leading-5 text-[var(--muted-text)]">
                              Do not open suspicious links. Verify the
                              domain through an official website or
                              trusted source before continuing.
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            <div className="border-t border-[var(--card-border)] p-6 md:p-8">
              <div
                className={`rounded-xl border p-5 ${
                  result.prediction === "SCAM"
                    ? "border-red-500/10 bg-red-500/5"
                    : result.prediction === "SUSPICIOUS"
                      ? "border-yellow-500/10 bg-yellow-500/5"
                      : "border-emerald-500/10 bg-emerald-500/5"
                }`}
              >
                <h3
                  className={`font-semibold ${
                    result.prediction === "SCAM"
                      ? "text-red-400"
                      : result.prediction === "SUSPICIOUS"
                        ? "text-yellow-500 dark:text-yellow-300"
                        : "text-emerald-500 dark:text-emerald-300"
                  }`}
                >
                  Recommended Action
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--muted-text)]">
                  {result.prediction === "SCAM"
                    ? "Do not click suspicious links, share OTPs or passwords, or send money. Verify the sender through an official channel."
                    : result.prediction === "SUSPICIOUS"
                      ? "Be careful before responding or clicking links. Verify the sender and information independently."
                      : "No major scam indicators were detected. Still verify unexpected requests before sharing sensitive information."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-[var(--card-border)] p-6 text-center sm:flex-row sm:justify-center">
              <button
                onClick={handleClear}
                className="rounded-xl border border-[var(--card-border)] px-6 py-3 text-sm font-medium text-[var(--muted-text)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              >
                Scan Another Message
              </button>

              <a
                href="/history"
                className="rounded-xl border border-blue-500/20 px-6 py-3 text-sm font-medium text-blue-500 dark:text-blue-300 transition hover:bg-blue-500/10"
              >
                View Scan History →
              </a>
            </div>
          </div>
        )}

        {!result && (
          <div className="mt-8">
            <p className="text-sm font-medium">
              Not sure what to scan?
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <button
                onClick={() => {
                  setMessage(
                    "Congratulations! You have won ₹50,000. Click this link immediately to claim your prize."
                  );
                  setError("");
                  setSuccessMessage("");
                }}
                disabled={loading}
                className="rounded-xl border border-[var(--card-border)] bg-[var(--card-background)] p-4 text-left text-sm text-[var(--muted-text)] transition hover:border-blue-500/30 hover:bg-blue-500/5 disabled:opacity-50"
              >
                <span className="font-medium text-[var(--foreground)]">
                  Prize scam example
                </span>

                <span className="mt-1 block">
                  Click to load a sample suspicious message.
                </span>
              </button>

              <button
                onClick={() => {
                  setMessage(
                    "Your account requires verification. Please visit our official website to review your account."
                  );
                  setError("");
                  setSuccessMessage("");
                }}
                disabled={loading}
                className="rounded-xl border border-[var(--card-border)] bg-[var(--card-background)] p-4 text-left text-sm text-[var(--muted-text)] transition hover:border-blue-500/30 hover:bg-blue-500/5 disabled:opacity-50"
              >
                <span className="font-medium text-[var(--foreground)]">
                  Safe-style example
                </span>

                <span className="mt-1 block">
                  Click to load a sample message.
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-5">
          <div className="flex gap-3">
            <span className="text-emerald-400">🔒</span>

            <div>
              <h3 className="text-sm font-semibold text-emerald-500 dark:text-emerald-300">
                Your messages are protected
              </h3>

              <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">
                Messages are processed securely and your scan history
                is associated only with your authenticated account.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
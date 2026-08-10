"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  LockIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";
import ToastContainer, { toast } from "@/components/toast";

type ResetStep = "closed" | "code" | "credentials";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [resetStep, setResetStep] = useState<ResetStep>("closed");
  const [resetCode, setResetCode] = useState("");
  const [verifiedCode, setVerifiedCode] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push("/admin/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const closeReset = () => {
    setResetStep("closed");
    setResetCode("");
    setVerifiedCode("");
    setNewUsername("");
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setResetError("");
    setResetBusy(false);
  };

  const handleConfirmCode = async () => {
    setResetError("");
    if (!resetCode.trim()) {
      setResetError("Enter the reset code first");
      return;
    }
    setResetBusy(true);
    try {
      const res = await fetch("/api/auth/reset-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code: resetCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Invalid reset code");
        toast.error(data.error || "Invalid reset code");
        return;
      }
      setVerifiedCode(resetCode.trim());
      setResetStep("credentials");
      toast.success("Code confirmed — set your new username and password");
    } catch {
      setResetError("Could not verify the code. Try again.");
      toast.error("Could not verify the code. Try again.");
    } finally {
      setResetBusy(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (newUsername.trim().length < 3) {
      setResetError("Username must be at least 3 characters");
      return;
    }
    if (newPassword.length < 3) {
      setResetError("Password must be at least 3 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }
    setResetBusy(true);
    try {
      const res = await fetch("/api/auth/reset-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          code: verifiedCode,
          newUsername: newUsername.trim(),
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Failed to update credentials");
        toast.error(data.error || "Failed to update credentials");
        return;
      }
      toast.success("Username and password updated — sign in with the new details");
      setUsername(newUsername.trim());
      setPassword("");
      closeReset();
    } catch {
      setResetError("Could not update credentials. Try again.");
      toast.error("Could not update credentials. Try again.");
    } finally {
      setResetBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        const errorMsg = data.message
          ? `${data.error}: ${data.message}`
          : data.error || "Login failed";
        setError(errorMsg);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f5f4]">
      <ToastContainer />
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% -10%, rgba(118,39,39,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(118,39,39,0.12), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: "#762727" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "#762727" }}
      />

      <div className="relative z-[1] mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10 md:px-8 lg:px-12">
        <Link
          href="/"
          className="mb-8 inline-flex w-max items-center gap-2 text-sm font-semibold text-[#762727]/80 transition-colors hover:text-[#762727]"
        >
          <ArrowLeftIcon size={16} />
          Back to website
        </Link>

        <div className="grid overflow-hidden rounded-3xl border border-[#762727]/12 bg-white shadow-[0_24px_80px_rgba(118,39,39,0.12)] lg:grid-cols-2">
          {/* Brand panel */}
          <div
            className="relative hidden flex-col justify-between p-8 text-white lg:flex lg:p-10"
            style={{
              background:
                "linear-gradient(160deg, #762727 0%, #5a1e1e 55%, #3d1414 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-20">
              <Image
                src="/assets/bgimg.webp"
                alt=""
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative z-[1]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
                  <Image
                    src="/assets/gnoalogo.png"
                    alt="GNOA"
                    width={36}
                    height={36}
                    className="h-8 w-auto"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                    GNOA Sri Lanka
                  </p>
                  <p className="font-urbanist text-lg font-bold leading-tight">
                    Content Studio
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-[1] mt-16 space-y-4">
              <h1 className="font-urbanist text-3xl font-bold leading-tight xl:text-4xl">
                Manage news, photos, videos &amp; banners in one place.
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-white/75">
                Sign in to update the public website — galleries, announcements,
                and stories for nursing officers across Sri Lanka.
              </p>
            </div>

            <div className="relative z-[1] mt-10 flex items-center gap-2 text-xs text-white/55">
              <ShieldCheckIcon size={14} />
              Secure admin access
            </div>
          </div>

          {/* Form panel — all steps stacked so card height stays constant */}
          <div className="flex flex-col bg-[#fffaf8] p-6 sm:p-8 md:p-10">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <Image
                src="/assets/gnoalogo.png"
                alt="GNOA"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#762727]/70">
                  Admin
                </p>
                <p className="font-urbanist text-base font-bold text-[#762727]">
                  GNOA Dashboard
                </p>
              </div>
            </div>

            <div className="grid flex-1 content-center">
              {/* Sign in */}
              <div
                className={`col-start-1 row-start-1 ${
                  resetStep === "closed"
                    ? "relative z-[1]"
                    : "invisible pointer-events-none"
                }`}
                aria-hidden={resetStep !== "closed"}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#762727]">
                  Welcome back
                </p>
                <h2 className="mt-1 font-urbanist text-2xl font-bold text-gray-900 sm:text-3xl">
                  Sign in to continue
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Enter your admin credentials to manage website content.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                  inert={resetStep !== "closed" ? true : undefined}
                >
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-1.5 block text-xs font-bold text-[#762727]"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <UserIcon
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#762727]/50"
                      />
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required={resetStep === "closed"}
                        autoComplete="username"
                        tabIndex={resetStep === "closed" ? 0 : -1}
                        className="w-full rounded-xl border-2 border-[#762727]/15 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#762727] focus:ring-2 focus:ring-[#762727]/15"
                        placeholder="Admin username"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-xs font-bold text-[#762727]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <LockIcon
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#762727]/50"
                      />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={resetStep === "closed"}
                        autoComplete="current-password"
                        tabIndex={resetStep === "closed" ? 0 : -1}
                        className="w-full rounded-xl border-2 border-[#762727]/15 bg-white py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#762727] focus:ring-2 focus:ring-[#762727]/15"
                        placeholder="Your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={resetStep === "closed" ? 0 : -1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#762727]/55 transition-colors hover:text-[#762727]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                      <ShieldCheckIcon size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || resetStep !== "closed"}
                    tabIndex={resetStep === "closed" ? 0 : -1}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#762727] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(118,39,39,0.28)] transition-colors hover:bg-[#5f1f1f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        <ShieldCheckIcon size={17} />
                        Sign in
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep("code");
                      setResetError("");
                      setError("");
                    }}
                    tabIndex={resetStep === "closed" ? 0 : -1}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#762727]/75 transition-colors hover:text-[#762727]"
                  >
                    <KeyRoundIcon size={13} />
                    Reset username &amp; password
                  </button>
                </div>
              </div>

              {/* Verify code */}
              <div
                className={`col-start-1 row-start-1 ${
                  resetStep === "code"
                    ? "relative z-[1]"
                    : "invisible pointer-events-none"
                }`}
                aria-hidden={resetStep !== "code"}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#762727]">
                  Account recovery
                </p>
                <h2 className="mt-1 font-urbanist text-2xl font-bold text-gray-900 sm:text-3xl">
                  Verify reset code
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Enter the admin reset code, then confirm to continue.
                </p>

                <div className="mt-8 space-y-5">
                  <div>
                    <label
                      htmlFor="reset-code"
                      className="mb-1.5 block text-xs font-bold text-[#762727]"
                    >
                      Reset code
                    </label>
                    <div className="relative">
                      <KeyRoundIcon
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#762727]/50"
                      />
                      <input
                        id="reset-code"
                        type="password"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void handleConfirmCode();
                          }
                        }}
                        autoComplete="off"
                        tabIndex={resetStep === "code" ? 0 : -1}
                        placeholder="Enter reset code"
                        className="w-full rounded-xl border-2 border-[#762727]/15 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#762727] focus:ring-2 focus:ring-[#762727]/15"
                      />
                    </div>
                  </div>

                  {resetError && resetStep === "code" && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                      {resetError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => void handleConfirmCode()}
                    disabled={resetBusy || resetStep !== "code"}
                    tabIndex={resetStep === "code" ? 0 : -1}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#762727] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(118,39,39,0.28)] transition-colors hover:bg-[#5f1f1f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resetBusy && resetStep === "code" ? "Checking…" : "Confirm"}
                  </button>

                  <button
                    type="button"
                    onClick={closeReset}
                    tabIndex={resetStep === "code" ? 0 : -1}
                    className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#762727]/25 px-5 py-3 text-sm font-bold text-[#762727] transition-colors hover:bg-[#762727]/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* New credentials */}
              <div
                className={`col-start-1 row-start-1 ${
                  resetStep === "credentials"
                    ? "relative z-[1]"
                    : "invisible pointer-events-none"
                }`}
                aria-hidden={resetStep !== "credentials"}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#762727]">
                  New credentials
                </p>
                <h2 className="mt-1 font-urbanist text-2xl font-bold text-gray-900 sm:text-3xl">
                  Set username &amp; password
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Choose the new login details for this admin account.
                </p>

                <form
                  onSubmit={handleUpdateCredentials}
                  className="mt-8 space-y-5"
                  inert={resetStep !== "credentials" ? true : undefined}
                >
                  <div>
                    <label
                      htmlFor="new-username"
                      className="mb-1.5 block text-xs font-bold text-[#762727]"
                    >
                      New username
                    </label>
                    <div className="relative">
                      <UserIcon
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#762727]/50"
                      />
                      <input
                        id="new-username"
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required={resetStep === "credentials"}
                        autoComplete="off"
                        tabIndex={resetStep === "credentials" ? 0 : -1}
                        className="w-full rounded-xl border-2 border-[#762727]/15 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#762727] focus:ring-2 focus:ring-[#762727]/15"
                        placeholder="New username"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-1.5 block text-xs font-bold text-[#762727]"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <LockIcon
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#762727]/50"
                      />
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required={resetStep === "credentials"}
                        autoComplete="new-password"
                        tabIndex={resetStep === "credentials" ? 0 : -1}
                        className="w-full rounded-xl border-2 border-[#762727]/15 bg-white py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#762727] focus:ring-2 focus:ring-[#762727]/15"
                        placeholder="New password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        tabIndex={resetStep === "credentials" ? 0 : -1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#762727]/55 transition-colors hover:text-[#762727]"
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOffIcon size={16} />
                        ) : (
                          <EyeIcon size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-1.5 block text-xs font-bold text-[#762727]"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <LockIcon
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#762727]/50"
                      />
                      <input
                        id="confirm-password"
                        type={showNewPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={resetStep === "credentials"}
                        autoComplete="new-password"
                        tabIndex={resetStep === "credentials" ? 0 : -1}
                        className="w-full rounded-xl border-2 border-[#762727]/15 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#762727] focus:ring-2 focus:ring-[#762727]/15"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  {resetError && resetStep === "credentials" && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                      {resetError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={resetBusy || resetStep !== "credentials"}
                    tabIndex={resetStep === "credentials" ? 0 : -1}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#762727] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(118,39,39,0.28)] transition-colors hover:bg-[#5f1f1f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resetBusy && resetStep === "credentials"
                      ? "Saving…"
                      : "Save new credentials"}
                  </button>

                  <button
                    type="button"
                    onClick={closeReset}
                    tabIndex={resetStep === "credentials" ? 0 : -1}
                    className="inline-flex w-full items-center justify-center rounded-full border-2 border-[#762727]/25 px-5 py-3 text-sm font-bold text-[#762727] transition-colors hover:bg-[#762727]/5"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-gray-400">
              © 2026 Government Nursing Officers&apos; Association
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

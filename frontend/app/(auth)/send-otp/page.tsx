"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { sendOtp, getAuthToken } from "@/lib/auth";

type JwtPayload = {
  id: string;
  iat: number;
  exp: number;
};

export default function SendOtpPage() {
  const router = useRouter();

  useEffect(() => {
  const token = getAuthToken();

  if (!token) return;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    console.log("Decoded Token:", decoded);

    setUserId(decoded.id);
  } catch (error) {
    console.error("Token decode failed:", error);
  }
}, []);

  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await sendOtp(userId);

      setSuccess("OTP sent successfully.");

      setTimeout(() => {
        router.push(`/verify-otp?userId=${userId}`);
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send OTP."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell
      title="Verify your account"
      description="Send a one-time password to verify your identity."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Input
          label="User ID"
          name="userId"
          placeholder="User ID"
          required
          value={userId}
          readOnly
        />

        {error ? (
          <p className="rounded-2xl bg-tertiary-fixed px-4 py-3 text-sm font-medium text-tertiary">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-2xl bg-green-100 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </p>
        ) : null}

        <Button
          className="w-full justify-center"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>

      <div className="mt-8 rounded-[1.5rem] bg-surface-low p-4 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link
          className="font-semibold text-primary"
          href="/login"
        >
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}
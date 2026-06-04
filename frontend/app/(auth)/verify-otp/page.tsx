"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyOtp } from "@/lib/auth";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState(
    searchParams.get("userId") ?? ""
  );
  const [code, setCode] = useState("");
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
    await verifyOtp(userId, code);

    setSuccess("OTP verified successfully.");

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to verify OTP."
    );
  } finally {
    setIsLoading(false);
  }
}
  return (
    <AuthShell
      title="Verify OTP"
      description="Enter the OTP sent to your registered email."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Input
          label="User ID"
          name="userId"
          placeholder="Enter your User ID"
          required
          value={userId}
          readOnly
        />

        <Input
          label="OTP Code"
          name="code"
          onChange={(event) =>
            setCode(event.target.value)
          }
          placeholder="Enter OTP"
          required
          value={code}
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
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>

      <div className="mt-8 rounded-[1.5rem] bg-surface-low p-4 text-sm text-ink-soft">
        Back to{" "}
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
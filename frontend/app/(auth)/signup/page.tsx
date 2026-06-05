"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await signup({
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      router.replace("/send-otp");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell title="Create your neighborhood profile" description="Join with a real identity, list responsibly, and borrow with confidence.">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            autoComplete="given-name"
            label="First name"
            name="firstName"
            onChange={(event) => setFormData((current) => ({ ...current, firstName: event.target.value }))}
            placeholder="Nupur"
            required
            value={formData.firstName}
          />
          <Input
            autoComplete="family-name"
            label="Last name"
            name="lastName"
            onChange={(event) => setFormData((current) => ({ ...current, lastName: event.target.value }))}
            placeholder="Sharma"
            required
            value={formData.lastName}
          />
        </div>
        <Input
          autoComplete="email"
          label="Email address"
          name="email"
          onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
          placeholder="nupur@example.com"
          required
          type="email"
          value={formData.email}
        />
        <Input
          autoComplete="new-password"
          label="Create password"
          name="password"
          onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
          placeholder="Choose a secure password"
          required
          type="password"
          value={formData.password}
        />
        <Input
          autoComplete="new-password"
          label="Confirm password"
          name="confirmPassword"
          onChange={(event) => setFormData((current) => ({...current,confirmPassword: event.target.value,}))}
          placeholder="Confirm your password"
          required
          type="password"
          value={formData.confirmPassword}
        />
        {error ? <p className="rounded-2xl bg-tertiary-fixed px-4 py-3 text-sm font-medium text-tertiary">{error}</p> : null}
        <Button className="w-full justify-center" disabled={isLoading} type="submit">
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <div className="mt-8 rounded-[1.5rem] bg-surface-low p-4 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link className="font-semibold text-primary" href="/login">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}

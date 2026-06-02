"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData);
      const next = new URLSearchParams(window.location.search).get("next") ?? "/home";
      router.replace(next.startsWith("/") ? next : "/home");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell title="Sign in to Neighbourly" description="Welcome back. Pick up where your local rental flow left off.">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="username"
          label="Email"
          name="email"
          onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
          placeholder="hello@example.com"
          required
          value={formData.email}
        />
        <Input
          autoComplete="current-password"
          label="Password"
          name="password"
          onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
          placeholder="Enter your password"
          required
          type="password"
          value={formData.password}
        />
        {error ? <p className="rounded-2xl bg-tertiary-fixed px-4 py-3 text-sm font-medium text-tertiary">{error}</p> : null}
        <Button className="w-full justify-center" disabled={isLoading} type="submit">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="mt-8 rounded-[1.5rem] bg-surface-low p-4 text-sm text-ink-soft">
        New here?{" "}
        <Link className="font-semibold text-primary" href="/signup">
          Create an account
        </Link>
      </div>
    </AuthShell>
  );
}

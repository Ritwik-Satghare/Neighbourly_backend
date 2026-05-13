import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <AuthShell title="Sign in to Neighbourly" description="Welcome back. Pick up where your local rental flow left off.">
      <form className="grid gap-5">
        <Input label="Email or phone" placeholder="hello@example.com" />
        <Input label="Password" placeholder="Enter your password" type="password" />
        <Button className="w-full justify-center" href="/dashboard">
          Sign In
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

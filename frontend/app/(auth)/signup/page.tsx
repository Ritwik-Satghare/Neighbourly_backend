import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <AuthShell title="Create your neighborhood profile" description="Join with a real identity, list responsibly, and borrow with confidence.">
      <form className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="First name" placeholder="Sakshi" />
          <Input label="Last name" placeholder="Sharma" />
        </div>
        <Input label="Email address" placeholder="sakshi@example.com" type="email" />
        <Input label="Neighborhood" placeholder="Greenpoint, Brooklyn" />
        <Input label="Create password" placeholder="Choose a secure password" type="password" />
        <Button className="w-full justify-center" href="/dashboard">
          Create account
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

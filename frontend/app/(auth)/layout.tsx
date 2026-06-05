import type { ReactNode } from "react";
import { AuthRedirect } from "@/components/auth-redirect";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthRedirect>{children}</AuthRedirect>;
}

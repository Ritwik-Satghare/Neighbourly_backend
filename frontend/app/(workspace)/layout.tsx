import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import { workspaceNav } from "@/lib/data";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-background">
        <Navbar items={workspaceNav} variant="workspace" />

        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

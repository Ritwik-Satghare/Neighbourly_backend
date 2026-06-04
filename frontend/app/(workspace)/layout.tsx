"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { workspaceNav } from "@/lib/data";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar
        items={workspaceNav}
        variant="workspace"
        onMobileMenuToggle={() => setMobileSidebarOpen((v) => !v)}
      />

      <div className="flex w-full gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

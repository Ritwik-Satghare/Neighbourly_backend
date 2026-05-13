// import type { ReactNode } from "react";
// import { Navbar } from "@/components/navbar";
// import { Sidebar } from "@/components/sidebar";
// import { publicNav } from "@/lib/data";

// export default function WorkspaceLayout({ children }: { children: ReactNode }) {
//   return (
//     <div className="w-full">
//       <Navbar items={publicNav} />
//       <main className="flex w-full items-start gap-6 px-4 py-8 sm:px-6 lg:px-8">
//         <Sidebar />
//         <div className="min-w-0 flex-1">{children}</div>
//       </main>
//     </div>
//   );
// }

import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { publicNav } from "@/lib/data";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background">
      
      {/* Navbar */}
      <Navbar items={publicNav} />

      {/* Main Content */}
      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

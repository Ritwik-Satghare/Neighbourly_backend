import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { publicNav } from "@/lib/data";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar items={publicNav} />
      {children}
      <Footer />
    </div>
  );
}

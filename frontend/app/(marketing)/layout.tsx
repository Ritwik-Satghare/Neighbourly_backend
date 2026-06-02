import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { marketingNav } from "@/lib/data";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar items={marketingNav} variant="marketing" />
      {children}
      <Footer />
    </div>
  );
}

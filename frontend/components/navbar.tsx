// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Bell, Menu, MessageCircle, Plus } from "lucide-react";
// import { BrandLogo } from "@/components/brand-logo";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import type { NavItem } from "@/lib/data";

// type NavbarProps = {
//   items: NavItem[];
// };

// export function Navbar({ items }: NavbarProps) {
//   const pathname = usePathname();

//   return (
//     <header className="sticky top-0 z-40 border-b border-outline/30 bg-surface/80 backdrop-blur-xl">
//       <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
//         <div className="flex items-center gap-10">
//           <BrandLogo />
//           <nav className="hidden items-center gap-6 md:flex">
//             {items.map((item) => (
//               <Link
//                 key={item.href}
//                 className={cn(
//                   "text-sm font-medium text-ink-soft transition hover:text-primary",
//                   pathname === item.href && "text-primary",
//                 )}
//                 href={item.href}
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </nav>
//         </div>
//         <div className="flex items-center gap-2 md:gap-3">
//           <Link className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low" href="/notifications">
//             <Bell className="h-5 w-5" />
//           </Link>
//           <Link className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low" href="/messages">
//             <MessageCircle className="h-5 w-5" />
//           </Link>
//           <Button className="hidden md:inline-flex" href="/create-listing">
//             <Plus className="mr-2 h-4 w-4" />
//             List an Item
//           </Button>
//           <button className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low md:hidden">
//             <Menu className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, MessageCircle } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/data";

type NavbarProps = {
  items: NavItem[];
};

export function Navbar({ items }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-outline/30 bg-surface/80 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-10">
          <BrandLogo />

          <nav className="hidden items-center gap-6 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                className={cn(
                  "text-sm font-medium text-ink-soft transition hover:text-primary",
                  pathname === item.href && "text-primary"
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3">

          <Link
            className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low"
            href="/notifications"
          >
            <Bell className="h-5 w-5" />
          </Link>

          <Link
            className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low"
            href="/messages"
          >
            <MessageCircle className="h-5 w-5" />
          </Link>

          <button className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

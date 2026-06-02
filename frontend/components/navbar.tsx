// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Bell, Menu, MessageCircle } from "lucide-react";

// import { BrandLogo } from "@/components/brand-logo";
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

//         {/* Left */}
//         <div className="flex items-center gap-10">
//           <BrandLogo />

//           <nav className="hidden items-center gap-6 md:flex">
//             {items.map((item) => (
//               <Link
//                 key={item.href}
//                 className={cn(
//                   "text-sm font-medium text-ink-soft transition hover:text-primary",
//                   pathname === item.href && "text-primary"
//                 )}
//                 href={item.href}
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         {/* Right */}
//         <div className="flex items-center gap-2 md:gap-3">

//           <Link
//             className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low"
//             href="/notifications"
//           >
//             <Bell className="h-5 w-5" />
//           </Link>

//           <Link
//             className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low"
//             href="/messages"
//           >
//             <MessageCircle className="h-5 w-5" />
//           </Link>

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
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import {
  Bell,
  Menu,
  MessageCircle,
  User,
  LogOut,
} from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import { clearAuthSession } from "@/lib/auth";

import type { NavItem } from "@/lib/data";

type NavbarProps = {
  items: NavItem[];
  variant?: "marketing" | "workspace";
};

export function Navbar({ items, variant = "workspace" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMarketing = variant === "marketing";

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Sign Out
  const handleSignOut = () => {
    clearAuthSession();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-outline/30 bg-surface/80 backdrop-blur-xl">
      <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-10">

          <BrandLogo href={isMarketing ? "/" : "/home"} />

          <nav className="hidden items-center gap-6 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-ink-soft transition hover:text-primary",
                  pathname === item.href && "text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3">
          {isMarketing ? (
            <>
              <Link
                className="hidden rounded-2xl px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-surface-low hover:text-primary sm:inline-flex"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="inline-flex rounded-2xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-ambient transition hover:-translate-y-0.5"
                href="/signup"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low"
                href="/notifications"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </Link>

              <Link
                className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low"
                href="/messages"
                aria-label="Messages"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-low transition hover:bg-surface-card"
                  aria-label="Account menu"
                >
                  <User className="h-5 w-5 text-ink-strong" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-40 rounded-2xl border border-outline/20 bg-white p-2 shadow-xl">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-surface-low"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Menu */}
          <button className="rounded-full p-2 text-ink-soft transition hover:bg-surface-low md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

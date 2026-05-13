import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Neighbourly",
  description: "Modern neighborhood rentals rebuilt in Next.js.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${jakarta.variable} min-h-screen w-full overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}

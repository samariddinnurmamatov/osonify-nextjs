"use client";

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export function FontProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      {children}
    </div>
  );
}

"use client";

import { AuthGuard } from "@/features/auth";

interface HomeContentProps {
  title: string;
}

export function HomeContent({ title }: HomeContentProps) {
  return (
    <AuthGuard>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <h1>{title}</h1>
      </div>
    </AuthGuard>
  );
}


"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { User } from "lucide-react";
import { TelegramLoginButton, TokenDebugPanel } from "@/features/auth/ui";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center text-center space-y-5">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-[#FE4838] flex items-center justify-center">
              <User className="text-white w-10 h-10" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Osonify.ai
            </h1>
            <p className="text-sm text-muted-foreground">Please log in</p>
          </div>

          <TelegramLoginButton />
        </CardContent>
      </Card>
      <TokenDebugPanel />
    </div>
  );
}

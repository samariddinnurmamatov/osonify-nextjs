"use client";

import * as React from "react";
import { Moon, Sun, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useThemeSwitcher } from "../model/useThemeSwitcher";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useTranslations } from "next-intl";

export function ThemeSwitch() {
  const { theme, setTheme } = useThemeSwitcher();
  const t = useTranslations("Theme");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative scale-95 rounded-full"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t("toggle")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("light")}
          <Check size={14} className={cn("ms-auto", theme !== "light" && "hidden")} />
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("dark")}
          <Check size={14} className={cn("ms-auto", theme !== "dark" && "hidden")} />
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("system")}
          <Check size={14} className={cn("ms-auto", theme !== "system" && "hidden")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}




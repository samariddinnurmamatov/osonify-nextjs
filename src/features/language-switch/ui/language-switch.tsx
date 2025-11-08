"use client";

import { useState } from "react";
import { AppLocale } from "@/shared/config/i18n";
import { useLanguageSwitcher } from "../model/useLanguageSwitcher";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const languages = [
  { code: "uz" as AppLocale, name: "O'zbek", flag: "🇺🇿" },
  { code: "en" as AppLocale, name: "English", flag: "🇺🇸" },
  { code: "ru" as AppLocale, name: "Русский", flag: "🇷🇺" },
];

interface LanguageSwitchProps {
  className?: string;
}

export function LanguageSwitch({ className }: LanguageSwitchProps) {
  const { currentLocale, changeLocale } = useLanguageSwitcher();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (nextLocale: AppLocale) => {
    void changeLocale(nextLocale);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground",
            className
          )}
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="sr-only">Tilni o'zgartirish</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              currentLocale === language.code && "bg-accent"
            )}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="text-sm">{language.name}</span>
            {currentLocale === language.code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}




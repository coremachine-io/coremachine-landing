"use client"

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TRPCProvider } from "@/lib/trpc-client";
import Home from "@/pages/Home";

export default function App() {
  return (
    <TRPCProvider>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Home />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TRPCProvider>
  );
}

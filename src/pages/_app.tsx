import type { AppProps } from "next/app";
import { TRPCProvider } from "@/lib/trpc-client";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TRPCProvider>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <Toaster />
          <Component {...pageProps} />
        </LanguageProvider>
      </ThemeProvider>
    </TRPCProvider>
  );
}

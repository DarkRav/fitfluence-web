import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppProviders } from "@/app/providers";
import { DevPanel } from "@/components/dev/dev-panel";
import { AuthProvider } from "@/features/auth/auth-provider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Fitfluence Web Admin",
  description: "Fitfluence admin panel",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${geist.variable} min-h-screen`}>
        <AppProviders>
          <AuthProvider>
            {children}
            <DevPanel />
          </AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}

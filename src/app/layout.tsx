import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { Header, Footer } from "@/components/chrome";
import { RegisterSW } from "@/components/register-sw";
import "./globals.css";

const themeInit = `(function(){try{var t=localStorage.getItem('studypro.theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Study Pro — The Nigerian Study App. Primary 1 to SS3.",
    template: "%s · Study Pro",
  },
  description:
    "Full NERDC & WAEC curriculum with lesson notes, quizzes, past questions, CBT practice, flashcards and study tools for every subject — Primary 1 to SS3. Works offline.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Study Pro" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1712" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <RegisterSW />
      </body>
    </html>
  );
}

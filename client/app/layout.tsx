import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoParkPro AI",
  description: "Command-center dashboard for NoParkPro AI operations.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${ibmPlexSans.variable} ${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-background text-on-surface">{children}</body>
    </html>
  );
}

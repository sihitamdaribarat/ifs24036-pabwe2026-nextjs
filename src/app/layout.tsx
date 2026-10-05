import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/components/Providers";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Delcom Posts - PABWE 2026 Next.js",
  description: "Aplikasi Manajemen Postingan Delcom berbasis Next.js dan Bun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={fontSans.variable}>
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

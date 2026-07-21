import type { Metadata } from "next";
import { Poppins, Sora } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EMOVibes | Feel the Music, Live the Vibe",
  description: "An ultra-premium, ad-free, secure, and beautiful Android music player.",
  icons: {
    icon: '/icon.png?v=2',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.variable} ${poppins.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

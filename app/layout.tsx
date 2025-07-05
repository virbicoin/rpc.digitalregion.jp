import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VirBiCoin Node Information",
  description: "VirBiCoin VBC Cryptocurrency NFT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
        <header className="w-full bg-gray-800 py-6 shadow-lg">
          <div className="max-w-screen-lg mx-auto px-4">
            <h1 className="text-4xl font-bold text-white text-center">
              VirBiCoin Node Information
            </h1>
          </div>
        </header>
        <main className="max-w-screen-lg mx-auto px-4">{children}</main>
        <footer className="w-full bg-gray-800">
          <div className="max-w-screen-lg mx-auto px-4 text-center py-6 text-white text-base">
            <p>
              &copy; 2024-{new Date().getFullYear()} Digitalregion, Inc. All Rights
              Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

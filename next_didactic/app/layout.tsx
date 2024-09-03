import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from './layout-client';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Didactic Learning App",
  description: "Learn what you know, don't know, and don't know you don't know",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 dark:bg-black dark:text-white`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

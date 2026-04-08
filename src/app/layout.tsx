import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rele — Study Smarter",
  description: "Personal learning platform to prepare for tests with flashcards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body grain-overlay">
        {children}
      </body>
    </html>
  );
}
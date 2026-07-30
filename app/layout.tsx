import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promptbench — a prompt IDE",
  description:
    "Write, run, and compare prompts side by side. Zero-shot, few-shot, chain-of-thought — scored on the same model, live.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

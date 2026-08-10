import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITC Club Ratings",
  description: "Rate the ITC technical council clubs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

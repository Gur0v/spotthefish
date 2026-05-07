import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spot the Fish",
  description: "Короткі ігри для розпізнавання онлайн-шахрайства.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

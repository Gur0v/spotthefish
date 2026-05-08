import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://spotthefish.vercel.app"),
  title: "Spot the Fish",
  description: "Короткі ігри для розпізнавання онлайн-шахрайства.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Spot the Fish",
    description: "Короткі ігри для розпізнавання онлайн-шахрайства.",
    url: "https://spotthefish.vercel.app",
    siteName: "Spot the Fish",
    locale: "uk_UA",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1774,
        height: 887,
        alt: "Spot the Fish - Фішко допомагає розпізнавати онлайн-шахрайство",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spot the Fish",
    description: "Короткі ігри для розпізнавання онлайн-шахрайства.",
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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

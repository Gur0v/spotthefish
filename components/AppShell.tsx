"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Lightbulb, Map, Settings, Star } from "lucide-react";
import { BackgroundPreloader } from "./BackgroundPreloader";
import { ProgressProvider, useProgress } from "./ProgressProvider";
import { BrandLogo } from "./Fishko";

function NavInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { progress } = useProgress();
  const links = [
    { href: "/learn", label: "Learn", icon: Map },
    { href: "/tips", label: "Tips", icon: Lightbulb },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-fish-border bg-fish-background backdrop-blur">
        <nav className="desktop-wrap flex h-16 items-center justify-between lg:h-[76px]">
          <Link href="/" className="flex min-w-0 items-center gap-2 font-extrabold text-xl text-fish-text lg:gap-3 lg:text-2xl">
            <BrandLogo compact />
            <span className="truncate">Spot the Fish</span>
          </Link>
          <div className="hidden items-center gap-2 rounded-3xl border border-fish-border bg-white p-2 lg:flex">
            {links.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-11 items-center gap-2 rounded-2xl px-5 font-extrabold transition ${
                    active ? "bg-fish-light text-fish-dark" : "text-fish-muted hover:bg-fish-light hover:text-fish-dark"
                  }`}
                >
                  <Icon size={19} aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2 font-extrabold lg:gap-3">
            <div className="flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-fish-text ring-1 ring-fish-border lg:gap-2 lg:px-4">
              <Star size={20} className="fill-fish-warning text-fish-warning" aria-hidden />
              {progress.totalStars}
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-fish-text ring-1 ring-fish-border lg:gap-2 lg:px-4">
              <Flame size={20} className="text-fish-warning" aria-hidden />
              {progress.streak}
            </div>
          </div>
        </nav>
      </header>
      <main className="pb-28 pt-5 lg:pb-12 lg:pt-8">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-fish-border bg-white px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-12px_35px_rgba(29,155,240,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-extrabold ${
                  active ? "bg-fish-light text-fish-dark" : "text-fish-muted"
                }`}
              >
                <Icon size={21} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <BackgroundPreloader />
      <NavInner>{children}</NavInner>
    </ProgressProvider>
  );
}

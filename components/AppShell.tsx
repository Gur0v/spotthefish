"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Lightbulb, Map, Settings, Star } from "lucide-react";
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
      <header className="sticky top-0 z-30 border-b border-fish-border/80 bg-fish-background/90 backdrop-blur">
        <nav className="desktop-wrap flex h-[76px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-2xl text-fish-text">
            <BrandLogo compact />
            Spot the Fish
          </Link>
          <div className="flex items-center gap-2 rounded-3xl border border-fish-border bg-white p-2">
            {links.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-11 items-center gap-2 rounded-2xl px-5 font-extrabold transition ${
                    active ? "bg-fish-light text-fish-dark" : "text-fish-muted hover:bg-slate-50 hover:text-fish-text"
                  }`}
                >
                  <Icon size={19} aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3 font-extrabold">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-fish-text ring-1 ring-fish-border">
              <Star size={20} className="fill-fish-warning text-fish-warning" aria-hidden />
              {progress.totalStars}
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-fish-text ring-1 ring-fish-border">
              <Flame size={20} className="text-fish-warning" aria-hidden />
              {progress.streak}
            </div>
          </div>
        </nav>
      </header>
      <main className="pb-12 pt-8">{children}</main>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <NavInner>{children}</NavInner>
    </ProgressProvider>
  );
}

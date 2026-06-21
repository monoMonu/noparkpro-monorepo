"use client";

import { Bell, Map, Siren, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getDashboardRoute, navItems, sidebarFooterItems, topbarIcons } from "./data";
import { AssistantChat } from "@/components/ui/AssistantChat";

type ShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: ShellProps) {
  const pathname = usePathname();
  const activeRoute = getDashboardRoute(pathname);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 shrink-0 border-r border-outline-variant bg-surface-container md:flex md:flex-col">
        <div className="px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold leading-none text-primary">Command Center</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-on-surface-variant">Vigilance Alpha-1</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.href === activeRoute.href ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 border-r-2 px-4 py-3 text-left transition-colors",
                item.href === activeRoute.href
                  ? "border-primary bg-primary-container/10 text-primary"
                  : "border-transparent text-on-surface-variant hover:bg-surface-variant/60 hover:text-on-surface",
              )}
            >
              <item.icon className={cn("h-5 w-5")} />
              <span className={cn("text-sm", item.href === activeRoute.href && "font-medium")}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-4 pb-4 pt-2">
          <Button variant="danger" className="w-full rounded-xs font-semibold uppercase tracking-wide">
            <Siren className="h-4.5 w-4.5" /> Emergency Dispatch
          </Button>
          <div className="my-4 h-px bg-outline-variant" />
          <div className="space-y-1">
            {sidebarFooterItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-variant/60 hover:text-on-surface"
              >
                <item.icon className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col md:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-outline-variant bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/90 md:px-6">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="md:hidden">
                <div className="text-base font-semibold text-primary">{activeRoute.title}</div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-on-surface-variant">Vigilance Alpha-1</div>
              </div>
              <div className="hidden max-w-105 flex-1 md:block">
                <div className="relative">
                  <Bell className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant opacity-0" />
                  <Input className="h-10 pl-3" placeholder={activeRoute.searchPlaceholder} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {topbarIcons.map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                >
                  <Icon className="h-4.5 w-4.5" />
                </button>
              ))}
              <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant bg-surface text-on-surface transition-colors hover:bg-surface-container-low">
                <UserCircle2 className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mx-auto w-full max-w-360">
            <div className="mb-6">
              <h1 className="text-xl font-semibold tracking-tight text-on-surface md:text-2xl md:leading-8">{activeRoute.title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-on-surface-variant md:text-base">{activeRoute.subtitle}</p>
            </div>
            {children}
          </div>
        </main>
      </div>
      <AssistantChat />
    </div>
  );
}

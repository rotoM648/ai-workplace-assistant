import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Mail, CalendarClock, BookOpen, Menu, Sparkles } from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Email Generator", icon: Mail },
  { to: "/task-planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research-assistant", label: "Research Assistant", icon: BookOpen },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-muted",
            )}
          >
            <Icon className="size-4.5" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="brand-gradient flex size-9 items-center justify-center rounded-xl text-primary-foreground">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold">AI Workplace</span>
        <span className="block text-xs text-muted-foreground">Productivity Assistant</span>
      </span>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Brand />
        <div className="mt-8 flex-1">
          <p className="px-3 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Workspace
          </p>
          <NavLinks />
        </div>
        <div className="rounded-xl bg-primary-soft p-4">
          <p className="text-sm font-semibold text-accent-foreground">Demo workspace</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sample content is included so you can try every tool right away.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-4">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Brand />
                <div className="mt-8">
                  <NavLinks onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{description}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            {children}
            <AiDisclaimer compact />
          </div>
        </main>
      </div>
    </div>
  );
}

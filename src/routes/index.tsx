import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CalendarClock, Clock, Mail, Sparkles, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A workplace AI assistant that drafts emails, plans your day and turns research into clear, editable briefings.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, plan tasks and summarise research — all editable before you use it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email-generator",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Professional emails in a formal, friendly or persuasive tone — edit and copy in one click.",
    tag: "Writing",
  },
  {
    to: "/task-planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    body: "Turn tasks, deadlines and priorities into a realistic daily or weekly schedule.",
    tag: "Planning",
  },
  {
    to: "/research-assistant",
    icon: BookOpen,
    title: "AI Research Assistant",
    body: "Summaries, key points, insights and recommendations from any topic or article.",
    tag: "Research",
  },
] as const;

const STATS = [
  { label: "Drafts this week", value: "18", icon: Sparkles, note: "+6 vs last week" },
  { label: "Hours saved", value: "7.5", icon: Clock, note: "Estimated across the team" },
  { label: "Tasks planned", value: "42", icon: TrendingUp, note: "31 completed on time" },
] as const;

const ACTIVITY = [
  { title: "Client follow-up email drafted", meta: "Persuasive tone · 12 minutes ago" },
  { title: "Weekly schedule generated", meta: "9 tasks prioritised · 1 hour ago" },
  { title: "Briefing: four-day week pilot", meta: "Research Assistant · Yesterday" },
  { title: "Leave policy update email", meta: "Formal tone · Yesterday" },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Good day, Rotondwa — here's your AI workspace at a glance."
    >
      <section className="brand-gradient overflow-hidden rounded-2xl p-6 text-primary-foreground sm:p-8">
        <Badge variant="secondary" className="mb-4">
          AI powered
        </Badge>
        <h2 className="max-w-2xl text-2xl font-semibold sm:text-3xl">
          Write, plan and research faster — without losing your voice.
        </h2>
        <p className="mt-3 max-w-2xl text-sm opacity-90 sm:text-base">
          Every result is fully editable, so you stay in control of what leaves your desk.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/email-generator">
              Draft an email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent">
            <Link to="/task-planner">Plan my day</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="surface-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-accent-foreground">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {TOOLS.map(({ to, title, body, tag, icon: Icon }) => (
          <Link key={to} to={to} className="surface-card group flex flex-col gap-3 p-5 transition-shadow hover:shadow-elevated">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{title}</h3>
              <Badge variant="secondary">{tag}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{body}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
              Open tool <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <h3 className="font-semibold">Recent activity</h3>
          <ul className="mt-4 divide-y divide-border">
            {ACTIVITY.map((a) => (
              <li key={a.title} className="flex items-start gap-3 py-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <AiDisclaimer />
        </div>
      </section>
    </AppShell>
  );
}

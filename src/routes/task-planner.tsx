import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CalendarClock, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AiResultPanel } from "@/components/AiResultPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateAiText } from "@/lib/ai.functions";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn your task list, deadlines and priorities into a realistic daily or weekly schedule you can edit.",
      },
      { property: "og:title", content: "AI Task Planner | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Let AI prioritise your workload into a clear daily or weekly plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaskPlanner,
});

type Task = { id: string; name: string; deadline: string; priority: "High" | "Medium" | "Low" };

const SAMPLE: Task[] = [
  { id: "1", name: "Finalise Q3 client report", deadline: "Tomorrow 12:00", priority: "High" },
  { id: "2", name: "Prep slides for board demo", deadline: "Thursday", priority: "High" },
  { id: "3", name: "Review team leave requests", deadline: "Friday", priority: "Medium" },
  { id: "4", name: "Update CRM pipeline notes", deadline: "This week", priority: "Low" },
  { id: "5", name: "1:1 with new analyst", deadline: "Wednesday 15:00", priority: "Medium" },
];

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-accent text-accent-foreground",
  Low: "bg-muted text-muted-foreground",
};

function TaskPlanner() {
  const generate = useServerFn(generateAiText);
  const [tasks, setTasks] = useState<Task[]>(SAMPLE);
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [range, setRange] = useState("Daily");
  const [hours, setHours] = useState("8");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTask = () => {
    if (!name.trim()) {
      toast.error("Give the task a name first.");
      return;
    }
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), deadline: deadline.trim() || "No deadline", priority },
    ]);
    setName("");
    setDeadline("");
    setPriority("Medium");
    toast.success("Task added");
  };

  const onGenerate = async () => {
    if (tasks.length === 0) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { text } = await generate({
        data: {
          instructions:
            "You are a workplace planning assistant. Build realistic, time-blocked schedules from a task list. Rules: output plain text only (no markdown symbols); order work by deadline urgency then priority; include focused blocks, short breaks, and a buffer for unplanned work; end with a short 'Priority order' list and a 'Watch-outs' line about risks or overcommitment. Do not invent tasks, meetings or deadlines the user did not provide.",
          prompt: [
            `Schedule type: ${range}`,
            `Available working hours per day: ${hours}`,
            "Tasks:",
            ...tasks.map(
              (t, i) => `${i + 1}. ${t.name} — deadline: ${t.deadline} — priority: ${t.priority}`,
            ),
          ].join("\n"),
        },
      });
      setResult(text);
      toast.success("Schedule ready — adjust it to suit your day.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Task Planner"
      description="Capture tasks, deadlines and priorities — get a plan that actually fits your day."
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="surface-card space-y-5 p-5 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="task-name">Task</Label>
            <Input
              id="task-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Draft supplier contract summary"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-deadline">Deadline</Label>
              <Input
                id="task-deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Friday 16:00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
                <SelectTrigger id="task-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addTask} variant="secondary" className="w-full">
            <Plus className="size-4" />
            Add task
          </Button>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Your tasks ({tasks.length})</p>
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">Due: {t.deadline}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge className={PRIORITY_STYLES[t.priority]} variant="secondary">
                      {t.priority}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove ${t.name}`}
                      onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
              {tasks.length === 0 ? (
                <li className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  No tasks yet — add your first one above.
                </li>
              ) : null}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="range">Plan for</Label>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger id="range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Today</SelectItem>
                  <SelectItem value="Weekly">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Working hours / day</Label>
              <Input
                id="hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                inputMode="numeric"
              />
            </div>
          </div>

          <Button onClick={onGenerate} disabled={loading} className="w-full">
            <Sparkles className="size-4" />
            {loading ? "Planning…" : "Generate schedule"}
          </Button>
        </section>

        <section className="surface-card space-y-4 p-5 lg:col-span-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">Your schedule</h2>
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn't build the schedule</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <AiResultPanel
            value={result}
            onChange={setResult}
            loading={loading}
            rows={20}
            onReset={() => setResult("")}
            emptyHint="Add your tasks, choose a daily or weekly plan, and your schedule will appear here."
          />
        </section>
      </div>
    </AppShell>
  );
}

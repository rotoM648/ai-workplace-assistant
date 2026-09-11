import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AiResultPanel } from "@/components/AiResultPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateAiText } from "@/lib/ai.functions";

export const Route = createFileRoute("/research-assistant")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Summarise topics, questions or article text into key points, insights and recommendations you can edit.",
      },
      { property: "og:title", content: "AI Research Assistant | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Turn dense material into a clear summary, key points and next steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchAssistant,
});

const SAMPLE =
  "Our operations team is considering a four-day work week pilot for the support department. Leadership wants to know how it affects response times, staff retention and customer satisfaction, and what the main risks are for a 24-person team covering business hours.";

function ResearchAssistant() {
  const generate = useServerFn(generateAiText);
  const [input, setInput] = useState(SAMPLE);
  const [depth, setDepth] = useState("Balanced brief");
  const [audience, setAudience] = useState("Leadership team");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    if (!input.trim()) {
      toast.error("Enter a topic, question or some text to analyse.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { text } = await generate({
        data: {
          instructions:
            "You are a workplace research assistant. Produce a structured briefing in plain text (no markdown symbols) with these sections, each on its own line as a heading in capitals followed by content: SUMMARY (3-4 sentences), KEY POINTS (5-7 bullets using '- '), INSIGHTS (3-4 bullets explaining what it means in practice), RECOMMENDATIONS (3-5 concrete next steps), OPEN QUESTIONS (2-3 things to verify). Be balanced and note uncertainty. Never fabricate statistics, sources, dates or citations; if a figure would be needed, say what should be verified instead.",
          prompt: [
            `Audience: ${audience}`,
            `Depth: ${depth}`,
            `Topic, question or source text:\n${input}`,
          ].join("\n"),
        },
      });
      setResult(text);
      toast.success("Briefing ready — check the facts before sharing.");
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
      title="AI Research Assistant"
      description="Summarise a topic, question or long article into something you can act on."
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="surface-card space-y-5 p-5 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic, question or article text</Label>
            <Textarea
              id="topic"
              rows={12}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste an article, or ask something like 'What should we consider before rolling out hybrid work?'"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">Written for</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger id="audience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Leadership team">Leadership team</SelectItem>
                <SelectItem value="Project team">Project team</SelectItem>
                <SelectItem value="Client">Client</SelectItem>
                <SelectItem value="Personal notes">Personal notes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="depth">Depth</Label>
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger id="depth">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quick overview">Quick overview</SelectItem>
                <SelectItem value="Balanced brief">Balanced brief</SelectItem>
                <SelectItem value="In-depth analysis">In-depth analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full">
            <Search className="size-4" />
            {loading ? "Researching…" : "Generate briefing"}
          </Button>
        </section>

        <section className="surface-card space-y-4 p-5 lg:col-span-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">Research briefing</h2>
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn't generate the briefing</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <AiResultPanel
            value={result}
            onChange={setResult}
            loading={loading}
            rows={22}
            onReset={() => setResult("")}
            emptyHint="Your summary, key points, insights and recommendations will appear here."
          />
        </section>
      </div>
    </AppShell>
  );
}

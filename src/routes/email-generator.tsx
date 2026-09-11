import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AiResultPanel } from "@/components/AiResultPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails in formal, friendly or persuasive tones, then edit and copy them.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Generate polished workplace emails with AI and edit them before sending.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailGenerator,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
const LENGTHS = ["Short", "Standard", "Detailed"] as const;

function EmailGenerator() {
  const generate = useServerFn(generateAiText);
  const [recipient, setRecipient] = useState("Thabo Nkosi, Operations Manager");
  const [subject, setSubject] = useState("Request to move Thursday's project review");
  const [tone, setTone] = useState<string>("Formal");
  const [length, setLength] = useState<string>("Standard");
  const [context, setContext] = useState(
    "Our client demo was moved to Thursday morning, so the internal project review clashes. Propose Friday 10:00 instead, confirm the agenda stays the same, and thank the team for being flexible.",
  );
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    if (!context.trim()) {
      toast.error("Add a few details about the email first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { text } = await generate({
        data: {
          instructions:
            "You are a professional workplace communication assistant. Write complete, ready-to-send business emails. Rules: output plain text only (no markdown, no commentary); start with a 'Subject:' line, then a greeting, 2-4 concise paragraphs, a clear call to action, and a professional sign-off using [Your Name]. Never invent specific facts, figures, names or commitments that are not supplied by the user; use neutral placeholders in square brackets instead.",
          prompt: [
            `Recipient: ${recipient || "the recipient"}`,
            `Subject hint: ${subject || "(none provided)"}`,
            `Tone: ${tone}`,
            `Length: ${length}`,
            `Purpose and key points:\n${context}`,
          ].join("\n"),
        },
      });
      setResult(text);
      toast.success("Email drafted — review and edit before sending.");
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
      title="Smart Email Generator"
      description="Draft professional workplace emails in seconds, then make them your own."
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="surface-card space-y-5 p-5 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Priya Naidoo, Head of Finance"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject or goal</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Following up on the Q3 budget"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTHS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">What should the email say?</Label>
            <Textarea
              id="context"
              rows={7}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Key points, background, deadlines, what you need from the recipient…"
            />
          </div>
          <Button onClick={onGenerate} disabled={loading} className="w-full">
            <Wand2 className="size-4" />
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </section>

        <section className="surface-card space-y-4 p-5 lg:col-span-3">
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">Generated email</h2>
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn't generate the email</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <AiResultPanel
            value={result}
            onChange={setResult}
            loading={loading}
            onReset={() => setResult("")}
            emptyHint="Your draft will appear here. Fill in the details and select a tone to get started."
          />
        </section>
      </div>
    </AppShell>
  );
}

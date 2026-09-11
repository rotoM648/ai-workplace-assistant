import { ShieldCheck } from "lucide-react";

export function AiDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-accent/60 p-4 text-accent-foreground">
      <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p className={compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed"}>
        <span className="font-semibold">Responsible AI notice: </span>
        AI-generated content can be inaccurate or incomplete. Always review it for accuracy,
        relevance, privacy and appropriateness — and remove any confidential details — before using
        it in professional situations.
      </p>
    </div>
  );
}

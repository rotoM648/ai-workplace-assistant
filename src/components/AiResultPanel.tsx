import { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export function AiResultPanel({
  value,
  onChange,
  loading,
  emptyHint,
  rows = 16,
  onReset,
}: {
  value: string;
  onChange: (next: string) => void;
  loading: boolean;
  emptyHint: string;
  rows?: number;
  onReset?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Select the text and copy manually.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3" aria-live="polite" aria-busy="true">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
        <p className="text-sm text-muted-foreground">Generating with AI…</p>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/50 p-8 text-center text-sm text-muted-foreground">
        {emptyHint}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Editable AI result"
        className="resize-y bg-card font-medium whitespace-pre-wrap"
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={copy} variant="secondary">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        {onReset ? (
          <Button onClick={onReset} variant="ghost">
            <RotateCcw className="size-4" />
            Clear
          </Button>
        ) : null}
        <span className="self-center text-xs text-muted-foreground">
          Edit freely — changes are yours before you use it.
        </span>
      </div>
    </div>
  );
}

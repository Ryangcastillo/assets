import type { ReactNode } from "react";
import { Check, Zap } from "lucide-react";

export interface PricingCardFeature {
  id: string;
  label: string;
}

export interface PricingCardProps {
  name: string;
  price: string;
  description?: string;
  features: PricingCardFeature[];
  ctaLabel: string;
  onCtaClick?: () => void;
  highlight?: boolean;
  footer?: ReactNode;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  ctaLabel,
  onCtaClick,
  highlight = false,
  footer,
}: PricingCardProps) {
  return (
    <div
      className={`flex h-full flex-col justify-between rounded-3xl border bg-background p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${highlight ? "border-primary shadow-md" : ""}`}
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {highlight ? <Zap className="h-3.5 w-3.5 text-primary" /> : null}
          {name}
        </div>
        <div>
          <p className="text-4xl font-bold">{price}</p>
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <ul className="space-y-3 text-sm">
          {features.map((feature) => (
            <li key={feature.id} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-primary" />
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 space-y-4">
        <button
          type="button"
          onClick={onCtaClick}
          className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-foreground hover:bg-muted/80"}`}
        >
          {ctaLabel}
        </button>
        {footer}
      </div>
    </div>
  );
}

export default PricingCard;

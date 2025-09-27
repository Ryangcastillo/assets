import { PricingCard } from "./pricing-card";

const features = [
  { id: "unlimited", label: "Unlimited projects" },
  { id: "analytics", label: "Advanced analytics" },
  { id: "support", label: "Priority support" },
  { id: "ai", label: "AI-powered insights" },
];

export default function PricingCardPreview() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <PricingCard
        name="Pro"
        price="$29/mo"
        description="For product teams shipping production apps."
        features={features}
        ctaLabel="Start free trial"
        highlight
        footer={<p className="text-xs text-muted-foreground">No credit card required.</p>}
      />
      <PricingCard
        name="Starter"
        price="$12/mo"
        description="Great for small teams exploring AI workflows."
        features={features.slice(0, 3)}
        ctaLabel="Choose plan"
      />
    </div>
  );
}

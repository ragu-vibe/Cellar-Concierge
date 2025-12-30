\"use client\";

import { useRouter } from \"next/navigation\";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="space-y-10">
      <section className="hero-gradient rounded-[40px] border border-ink-100 bg-white p-12 shadow-soft">
        <div className="max-w-2xl space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-400">Cellar Concierge</p>
          <h1 className="font-display text-4xl md:text-5xl">Premium cellar planning, curated with your Account Manager.</h1>
          <p className="text-lg text-ink-600">
            A production-feeling prototype that pairs deterministic AI recommendations with a human AM approval loop.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push(\"/dashboard\")}>Enter member dashboard</Button>
            <Button variant="outline" onClick={() => router.push(\"/am\")}>Account Manager view</Button>
            <Button variant="outline" onClick={() => router.push(\"/admin/integrations\")}>Admin console</Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "AI drafts, AM curates",
            body: "Deterministic AI ranks inventory, then AMs edit, approve, and add signature notes."
          },
          {
            title: "Motive-led planning",
            body: "Conjoint-style onboarding captures scarcity, prestige, value, and drink windows."
          },
          {
            title: "Compliance-forward",
            body: "Indicative valuations and clear disclaimers, with no consumption nudging."
          }
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="space-y-3">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-ink-600">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

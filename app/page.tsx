"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="space-y-10">
      <section className="hero-gradient rounded-[40px] border border-ink-100 bg-white p-12 shadow-soft">
        <div className="max-w-2xl space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-400">Cellar Concierge</p>
          <h1 className="font-display text-4xl md:text-5xl">
            Your cellar, planned with a dedicated Account Manager.
          </h1>
          <p className="text-lg text-ink-600">
            Tell us how you collect and we will prepare a monthly plan that matches your goals, then your AM curates every bottle.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push("/onboarding")}>Begin your consultation</Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Preview member dashboard
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Curated by your AM",
            body: "Every draft plan is reviewed and refined by your Account Manager before it is finalized.",
          },
          {
            title: "Plans that match intent",
            body: "We learn why you buy, not just what you drink, so each allocation aligns to your collecting goals.",
          },
          {
            title: "Portfolio visibility",
            body: "Track drink windows, value bands, and gaps in your cellar with quiet, clear signals.",
          },
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

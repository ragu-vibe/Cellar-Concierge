"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { members } from "@/data/members";
import { monthlyPlans } from "@/data/plans";
import { MotiveRadarChart } from "@/components/MotiveRadarChart";
import { PlanItemRow } from "@/components/PlanItemRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function AMClientPage() {
  const params = useParams();
  const memberId = Array.isArray(params.id) ? params.id[0] : params.id;
  const member = members.find((item) => item.id === memberId) ?? members[0];
  const plan = monthlyPlans[0];
  const [note, setNote] = useState("Alex — I refined your plan with a touch more Rhône for dinner parties.");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Client detail</p>
        <h1 className="text-3xl font-semibold">{member.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Motive profile</CardTitle>
        </CardHeader>
        <CardContent>
          <MotiveRadarChart motives={member.motives} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {plan.items.map((item) => (
            <PlanItemRow key={item.item.id} item={item} />
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>AM Signature Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} />
            <div className="flex flex-col gap-2">
              <Button>Approve plan</Button>
              <Button variant="outline">Request tweaks</Button>
              <Button variant="outline">Suggest upgrade (+£15)</Button>
              <Button variant="ghost">Hold for later</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

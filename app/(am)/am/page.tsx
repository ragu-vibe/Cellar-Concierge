"use client";

import { useRouter } from "next/navigation";
import { approvalsQueue } from "@/data/approvals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AMDashboardPage() {
  const router = useRouter();
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Account Manager</p>
        <h1 className="text-3xl font-semibold">Approvals queue</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plans awaiting review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {approvalsQueue.map((approval) => (
            <div key={approval.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-ink-50 p-4">
              <div>
                <p className="text-sm text-ink-500">{approval.memberName}</p>
                <p className="text-lg font-semibold">Plan {approval.planId}</p>
              </div>
                <div className="flex items-center gap-3">
                  <Badge variant="warning">{approval.status}</Badge>
                <Button onClick={() => router.push(`/am/client/${approval.memberId}`)}>Review</Button>
                </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

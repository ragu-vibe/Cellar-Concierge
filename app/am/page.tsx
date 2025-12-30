'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { useDemoStore } from '@/lib/store/demoStore';

export default function AMQueuePage() {
  const plan = useDemoStore((state) => state.plan);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Approvals queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-white p-4">
            <div>
              <p className="font-semibold text-primary">Alex Morgan — September plan</p>
              <p className="text-xs text-muted">Budget £250 · Drafted by AI</p>
              <div className="mt-2">
                <StatusBadge status={plan.status} />
              </div>
            </div>
            <Button asChild>
              <Link href="/am/client/member-alex">Open review</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

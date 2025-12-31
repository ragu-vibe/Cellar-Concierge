'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDemoStore } from '@/lib/store/demoStore';

export default function MessagesPage() {
  const threads = useDemoStore((state) => state.messages);

  return (
    <div className="space-y-6">
      {threads.map((thread) => (
        <Card key={thread.id}>
          <CardHeader>
            <CardTitle>Conversation with {thread.participants.join(' & ')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {thread.messages.map((message) => (
              <div key={message.id} className="rounded-lg border border-border bg-white p-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{message.sender}</span>
                  <span>{message.time}</span>
                </div>
                <p className="mt-2 text-sm text-primary">{message.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

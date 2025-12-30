"use client";

import { messageThreads } from "@/data/messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Messages</p>
        <h1 className="text-3xl font-semibold">Conversations with your AM</h1>
      </div>

      {messageThreads.map((thread) => (
        <Card key={thread.id}>
          <CardHeader>
            <CardTitle>{thread.subject}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {thread.messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl px-4 py-3 text-sm ${
                  message.sender === "am" ? "bg-ink-100 text-ink-800" : "bg-ink-900 text-white"
                }`}
              >
                <div className="mb-2 flex items-center justify-between text-xs text-ink-400">
                  <span>{message.sender === "am" ? "Sophie" : "You"}</span>
                  <Badge variant="outline">{new Date(message.timestamp).toLocaleDateString()}</Badge>
                </div>
                {message.content}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/store/demoStore";
import { MotivationsPanel } from "./MotivationsPanel";

interface WelcomeMessageProps {
  startChat: () => void;
}

export function WelcomeMessage({ startChat }: WelcomeMessageProps) {
  const { member } = useDemoStore();

  if (!member.collectorProfile) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="max-w-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {member.name}!
        </h2>
        <p className="mb-6">
          Thanks for completing your profile. Based on your answers, we've
          created a collector profile for you. This will help us recommend the
          best wines for your cellar.
        </p>
        <div className="mb-6">
          <MotivationsPanel motivations={member.collectorProfile.motivations} />
        </div>
        <p className="mb-8">
          Ready to start building your cellar? Let's chat about what you're
          looking for.
        </p>
        <Button onClick={startChat}>Start Chat</Button>
      </div>
    </div>
  );
}

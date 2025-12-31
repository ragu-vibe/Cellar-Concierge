'use client';

import { CellarPlanningModal } from '@/components/onboarding/CellarPlanningModal';
import { WelcomeFlow } from '@/components/onboarding/WelcomeFlow';
import { ChatWidget } from '@/components/chat/ChatWidget';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CellarPlanningModal />
      <WelcomeFlow />
      <ChatWidget />
    </>
  );
}

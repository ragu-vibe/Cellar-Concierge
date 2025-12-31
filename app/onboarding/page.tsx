'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '@/lib/store/demoStore';

// This page redirects to the home page and opens the onboarding modal
export default function OnboardingPage() {
  const router = useRouter();
  const setShowOnboarding = useDemoStore((state) => state.setShowOnboarding);
  const hasCompletedOnboarding = useDemoStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    if (hasCompletedOnboarding) {
      router.push('/dashboard');
    } else {
      setShowOnboarding(true);
      router.push('/');
    }
  }, [hasCompletedOnboarding, router, setShowOnboarding]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-muted">Redirecting...</p>
    </div>
  );
}

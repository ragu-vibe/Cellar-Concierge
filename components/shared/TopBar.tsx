'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wine, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import { useDemoStore } from '@/lib/store/demoStore';

const navByRole: Record<string, { label: string; href: string }[]> = {
  member: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plan', href: '/plan' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Sell', href: '/sell' },
    { label: 'Messages', href: '/messages' }
  ],
  am: [
    { label: 'Queue', href: '/am' },
    { label: 'Client', href: '/am/client/member-alex' },
    { label: 'Requests', href: '/am/requests' }
  ],
  admin: [
    { label: 'Integrations', href: '/admin/integrations' },
    { label: 'Marketplace', href: '/admin/marketplace' }
  ]
};

export function TopBar() {
  const pathname = usePathname();
  const role = useDemoStore((state) => state.role);
  const setRole = useDemoStore((state) => state.setRole);
  const setShowOnboarding = useDemoStore((state) => state.setShowOnboarding);
  const navItems = navByRole[role];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          {/* BBR + Ragu Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bbr-burgundy">
              <Wine className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight text-foreground">
                Berry Bros. & Rudd
              </p>
              <p className="text-xs text-muted">
                Cellar Concierge
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-ink-100 text-foreground'
                    : 'text-muted hover:bg-ink-50 hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Settings / Recalibrate */}
          {role === 'member' && (
            <button
              onClick={() => setShowOnboarding(true)}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              title="Recalibrate preferences"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </button>
          )}

          {/* Role Switcher */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-2 py-1">
            <span className="text-xs uppercase tracking-wide text-muted">View as</span>
            <Select
              value={role}
              onChange={(event) => setRole(event.target.value as typeof role)}
              className="border-0 bg-transparent text-sm font-medium"
            >
              <option value="member">Member</option>
              <option value="am">Account Manager</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="container flex gap-2 overflow-x-auto pb-3 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              pathname === item.href
                ? 'border-bbr-burgundy bg-bbr-burgundy text-white'
                : 'border-border bg-white text-muted hover:border-ink-300'
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

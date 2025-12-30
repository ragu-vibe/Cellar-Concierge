'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import { useDemoStore } from '@/lib/store/demoStore';

const navByRole: Record<string, { label: string; href: string }[]> = {
  member: [
    { label: 'Onboarding', href: '/onboarding' },
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
  const navItems = navByRole[role];

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
            Cellar Concierge
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-muted'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-muted">Role</span>
          <Select value={role} onChange={(event) => setRole(event.target.value as typeof role)}>
            <option value="member">Member</option>
            <option value="am">Account Manager</option>
            <option value="admin">Admin</option>
          </Select>
        </div>
      </div>
      <div className="container flex gap-3 overflow-x-auto pb-3 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-full border border-border bg-white px-3 py-1 text-xs',
              pathname === item.href ? 'text-primary' : 'text-muted'
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

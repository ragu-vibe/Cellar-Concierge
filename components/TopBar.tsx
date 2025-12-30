"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wine, Shield, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/lib/store/demoStore";
import { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";

const roleNav: Record<Role, { href: string; label: string }[]> = {
  member: [
    { href: "/onboarding", label: "Onboarding" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/plan", label: "Plan" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/sell", label: "Sell" },
    { href: "/messages", label: "Messages" }
  ],
  am: [
    { href: "/am", label: "Approvals" },
    { href: "/am/requests", label: "Sell Requests" }
  ],
  admin: [
    { href: "/admin/integrations", label: "Integrations" },
    { href: "/admin/marketplace", label: "Marketplace" }
  ]
};

export function TopBar() {
  const pathname = usePathname();
  const { role, setRole } = useDemoStore();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-900 text-white">
            <Wine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Cellar Concierge</p>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Curated with your account manager</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {roleNav[role].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100",
                pathname === link.href && "bg-ink-900 text-white hover:bg-ink-800"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-ink-200 bg-white px-2 py-1">
            {(["member", "am", "admin"] as Role[]).map((roleOption) => (
              <button
                key={roleOption}
                className={cn(
                  "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium capitalize text-ink-600 transition",
                  role === roleOption && "bg-ink-900 text-white"
                )}
                onClick={() => setRole(roleOption)}
              >
                {roleOption === "member" && <UserCircle2 className="h-3 w-3" />}
                {roleOption === "am" && <Wine className="h-3 w-3" />}
                {roleOption === "admin" && <Shield className="h-3 w-3" />}
                {roleOption === "am" ? "Account Manager" : roleOption}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Live demo
          </Button>
        </div>
      </div>
    </header>
  );
}

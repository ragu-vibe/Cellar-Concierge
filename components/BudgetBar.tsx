import { cn } from "@/lib/utils";

export function BudgetBar({ budget, spent }: { budget: number; spent: number }) {
  const ratio = Math.min(spent / budget, 1);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-ink-600">
        <span>£{spent.toFixed(0)} spent</span>
        <span>£{budget.toFixed(0)} budget</span>
      </div>
      <div className="h-3 w-full rounded-full bg-ink-100">
        <div className={cn("h-3 rounded-full bg-ink-900", ratio > 0.9 && "bg-accent-600")} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}

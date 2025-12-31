import { cn } from '@/lib/utils';

export function BudgetBar({
  budget,
  spent,
  showLabels = false
}: {
  budget: number;
  spent: number;
  showLabels?: boolean;
}) {
  const percent = Math.min(100, Math.round((spent / budget) * 100));
  const isOverBudget = spent > budget;

  return (
    <div className="space-y-2">
      {showLabels && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Budget £{budget}</span>
          <span className={cn('font-medium', isOverBudget ? 'text-red-600' : 'text-primary')}>
            £{spent} used
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-ink-100 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isOverBudget ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-bbr-burgundy'
          )}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
}

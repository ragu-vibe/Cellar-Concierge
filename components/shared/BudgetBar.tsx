import { Progress } from '@/components/ui/progress';

export function BudgetBar({ budget, spent }: { budget: number; spent: number }) {
  const percent = Math.min(100, Math.round((spent / budget) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Budget £{budget}</span>
        <span className="font-medium text-primary">£{spent} used</span>
      </div>
      <Progress value={percent} />
    </div>
  );
}

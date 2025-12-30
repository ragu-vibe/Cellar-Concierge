import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CellarHealthScoreCard({ score, milestones, streak }: { score: number; milestones: string[]; streak: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cellar Health Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4">
          <span className="text-4xl font-semibold text-primary">{score}</span>
          <div className="text-sm text-muted">/ 100</div>
        </div>
        <div className="text-sm text-muted">Planning streak: {streak} months</div>
        <div className="flex flex-wrap gap-2">
          {milestones.map((milestone) => (
            <Badge key={milestone} variant="secondary">
              {milestone}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

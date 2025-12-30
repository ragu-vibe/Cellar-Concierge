import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CellarHealthScoreCard({ score }: { score: number }) {
  const rating = score > 85 ? "Exceptional" : score > 70 ? "Strong" : "Building";
  return (
    <Card className="bg-white">
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">Cellar Health</p>
          <p className="text-3xl font-semibold text-ink-900">{score}</p>
          <p className="text-sm text-ink-600">{rating} alignment across diversity & drink windows.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline">Rhône Explorer</Badge>
          <Badge variant="outline">Dinner Party Ready</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

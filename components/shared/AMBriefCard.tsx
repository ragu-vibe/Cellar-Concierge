import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AMBriefCard({ summary }: { summary: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AM Brief Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted">{summary}</p>
      </CardContent>
    </Card>
  );
}

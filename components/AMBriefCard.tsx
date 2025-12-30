import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AMBriefCard({ summary }: { summary: string }) {
  return (
    <Card className="bg-ink-900 text-white">
      <CardHeader>
        <CardTitle>AM Brief Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-ink-100">{summary}</p>
      </CardContent>
    </Card>
  );
}

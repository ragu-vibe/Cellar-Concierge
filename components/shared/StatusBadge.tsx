import { Badge } from '@/components/ui/badge';

const statusStyles: Record<string, string> = {
  Drafted: 'bg-accent/10 text-primary',
  'Sent to AM': 'bg-amber-100 text-amber-800',
  Approved: 'bg-emerald-100 text-emerald-800',
  Ready: 'bg-slate-200 text-slate-700'
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={statusStyles[status] || ''}>{status}</Badge>;
}

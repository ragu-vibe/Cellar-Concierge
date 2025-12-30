import { Badge } from "@/components/ui/badge";
import { PlanStatus } from "@/lib/types";

const statusVariant: Record<PlanStatus, { label: string; variant: "default" | "outline" | "success" | "warning" }> = {
  Drafted: { label: "Drafted", variant: "outline" },
  "Sent to AM": { label: "Sent to AM", variant: "warning" },
  Approved: { label: "Approved", variant: "success" },
  Ready: { label: "Ready", variant: "default" }
};

export function StatusBadge({ status }: { status: PlanStatus }) {
  const meta = statusVariant[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

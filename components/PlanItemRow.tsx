import { PlanItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function PlanItemRow({ item }: { item: PlanItem }) {
  return (
    <div className="rounded-3xl border border-ink-100 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{item.item.region}</p>
          <h4 className="text-lg font-semibold text-ink-900">{item.item.name}</h4>
          <p className="text-sm text-ink-600">£{item.item.price_gbp.toFixed(0)} • Drink {item.item.drink_window_start}-{item.item.drink_window_end}</p>
        </div>
        <Badge variant="outline">Qty {item.quantity}</Badge>
      </div>
      <p className="mt-3 text-sm text-ink-700">{item.rationale}</p>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">Substitutes</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.substitutes.map((sub) => (
            <Badge key={sub.id} variant="outline">
              {sub.producer} {sub.vintage}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

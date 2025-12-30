import { Badge } from '@/components/ui/badge';
import { InventoryItem } from '@/data/inventory';

export function PlanItemRow({ item, rationale, substitutes }: { item: InventoryItem; rationale: string; substitutes: InventoryItem[] }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-primary">{item.name}</h4>
          <p className="text-xs text-muted">{item.region} · £{item.price_gbp} · Drink {item.drink_window_start}-{item.drink_window_end}</p>
          <p className="mt-2 text-sm text-muted">{rationale}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Badge variant="outline">{item.scarcity_level} scarcity</Badge>
      </div>
      {substitutes.length > 0 && (
        <div className="mt-4 rounded-md border border-dashed border-border bg-accent/5 p-3">
          <p className="text-xs uppercase tracking-wide text-muted">Substitutes</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-primary">
            {substitutes.map((sub) => (
              <span key={sub.id} className="rounded-full bg-white px-3 py-1">
                {sub.producer} · £{sub.price_gbp}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

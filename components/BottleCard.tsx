import Image from "next/image";
import { InventoryItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function BottleCard({ item }: { item: InventoryItem }) {
  return (
    <div className="glass-card rounded-3xl p-4">
      <div className="flex gap-4">
        <Image src={item.image} alt={item.name} width={90} height={120} className="rounded-2xl object-cover" />
        <div className="space-y-2">
          <div>
            <p className="text-sm text-ink-500">{item.region}</p>
            <h4 className="text-base font-semibold text-ink-900">{item.name}</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-ink-600">£{item.price_gbp.toFixed(0)} • Drink {item.drink_window_start}-{item.drink_window_end}</p>
        </div>
      </div>
    </div>
  );
}

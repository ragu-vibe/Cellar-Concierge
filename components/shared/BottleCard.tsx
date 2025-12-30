import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { InventoryItem } from '@/data/inventory';

export function BottleCard({ item }: { item: InventoryItem }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <CardContent className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-primary">{item.name}</h3>
          <p className="text-xs text-muted">{item.region} · {item.vintage}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">£{item.price_gbp}</span>
          <span className="text-xs text-muted">Drink {item.drink_window_start}-{item.drink_window_end}</span>
        </div>
      </CardContent>
    </Card>
  );
}

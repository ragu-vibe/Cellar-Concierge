import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { InventoryItem } from '@/data/inventory';
import { WineBottlePlaceholder } from './WineBottlePlaceholder';

export function BottleCard({ item }: { item: InventoryItem }) {
  // Infer colour from region/grapes for placeholder
  const getColour = (): 'red' | 'white' | 'rose' | 'default' => {
    const redGrapes = ['Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Syrah', 'Nebbiolo', 'Tempranillo', 'Grenache', 'Sangiovese'];
    const whiteGrapes = ['Chardonnay', 'Riesling', 'Sauvignon Blanc', 'Sémillon'];

    if (item.grapes?.some(g => redGrapes.some(rg => g.includes(rg)))) return 'red';
    if (item.grapes?.some(g => whiteGrapes.some(wg => g.includes(wg)))) return 'white';
    if (item.region?.toLowerCase().includes('champagne')) return 'white';
    return 'default';
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full bg-ink-50 flex items-center justify-center p-4">
        <WineBottlePlaceholder colour={getColour()} className="h-full w-auto" />
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

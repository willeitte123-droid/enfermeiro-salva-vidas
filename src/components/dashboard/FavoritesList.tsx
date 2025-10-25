import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";
import { getIcon } from "@/lib/utils";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface FavoriteItem {
  title: string;
  path: string;
  icon: string;
}

interface FavoritesListProps {
  items: FavoriteItem[];
}

export function FavoritesList({ items }: FavoritesListProps) {
  const Icon = getIcon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Favoritos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <List>
            {items.map((item, index) => {
              const ItemIcon = Icon(item.icon);
              return (
                <ListItem key={index}>
                  <Link to={item.path} className="flex items-center gap-3 hover:underline">
                    <ItemIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.title}</span>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <p className="text-sm text-muted-foreground">
            Você ainda não marcou nenhuma ferramenta como favorita.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
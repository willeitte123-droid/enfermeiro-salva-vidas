import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";
import { getIcon } from "@/lib/utils";
import { History } from "lucide-react";
import { Link } from "react-router-dom";

interface ActivityItem {
  title: string;
  path: string;
  icon: string;
  timestamp: string;
}

interface RecentActivityListProps {
  items: ActivityItem[];
}

export function RecentActivityList({ items }: RecentActivityListProps) {
  const Icon = getIcon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <List>
            {items.map((item, index) => {
              const ItemIcon = Icon(item.icon);
              return (
                <ListItem key={index}>
                  <Link to={item.path} className="flex items-center justify-between w-full hover:underline">
                    <div className="flex items-center gap-3">
                      <ItemIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma atividade recente registrada.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
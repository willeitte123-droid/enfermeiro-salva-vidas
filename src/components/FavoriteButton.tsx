import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  userId: string;
  itemId: string;
  itemType: string;
  itemTitle: string;
  className?: string;
}

const FavoriteButton = ({ userId, itemId, itemType, itemTitle, className }: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavorite = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("item_id", itemId)
        .single();
      
      if (data && !error) {
        setIsFavorited(true);
      } else {
        setIsFavorited(false);
      }
      setIsLoading(false);
    };

    checkFavorite();
  }, [userId, itemId]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    if (isFavorited) {
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("item_id", itemId);

      if (error) {
        toast.error("Erro ao remover dos favoritos", { description: error.message });
      } else {
        toast.success(`"${itemTitle}" removido dos favoritos.`);
        setIsFavorited(false);
      }
    } else {
      const { error } = await supabase
        .from("user_favorites")
        .insert({ user_id: userId, item_id: itemId, item_type: itemType, item_title: itemTitle });

      if (error) {
        toast.error("Erro ao adicionar aos favoritos", { description: error.message });
      } else {
        toast.success(`"${itemTitle}" adicionado aos favoritos!`);
        setIsFavorited(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={cn("text-amber-400 hover:text-amber-500", className)}
      title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Star className={cn("h-5 w-5 transition-all", isFavorited && "fill-current")} />
      )}
    </Button>
  );
};

export default FavoriteButton;
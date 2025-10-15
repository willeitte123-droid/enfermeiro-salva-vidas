import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface FavoriteButtonProps {
  userId?: string;
  itemId: string;
  itemType: string;
  itemTitle: string;
  isInitiallyFavorited?: boolean;
  isLoading?: boolean;
  className?: string;
}

const FavoriteButton = ({ userId, itemId, itemType, itemTitle, isInitiallyFavorited = false, isLoading = false, className }: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [isMutating, setIsMutating] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsFavorited(isInitiallyFavorited);
  }, [isInitiallyFavorited]);

  const toggleFavorite = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast.error("Você precisa estar logado para adicionar aos favoritos.");
      return;
    }

    setIsMutating(true);

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
    // Invalidate queries to refetch favorites data on relevant pages
    queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    setIsMutating(false);
  };

  if (!userId) {
    return null; // Não renderiza o botão se não houver usuário
  }

  const displayLoading = isLoading || isMutating;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isFavorited}
      onClick={toggleFavorite}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleFavorite(e);
        }
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full h-10 w-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "text-amber-400 hover:bg-accent hover:text-amber-500",
        className
      )}
      title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      {displayLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Star className={cn("h-5 w-5 transition-all", isFavorited && "fill-current")} />
      )}
    </div>
  );
};

export default FavoriteButton;
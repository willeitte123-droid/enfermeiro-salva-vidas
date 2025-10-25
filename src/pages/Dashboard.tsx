import { useOutletContext } from "react-router-dom";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import {
  Calculator, ListChecks, Syringe, ClipboardList, Star, History, ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getIcon } from "@/lib/utils";

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
}

const quickAccessItems = [
  { title: "Gotejamento", icon: Calculator, path: "/calculator", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  { title: "Escalas Clínicas", icon: ListChecks, path: "/scales", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
  { title: "Medicamentos", icon: Syringe, path: "/medications", color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" },
  { title: "Procedimentos", icon: ClipboardList, path: "/procedures", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
];

const Dashboard = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { activities } = useActivityTracker();

  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from('favorites')
        .select('item_id, item_type, item_title')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const renderActivityList = () => {
    const recentActivities = [...activities].reverse().slice(0, 5);
    return (
      <div className="space-y-4">
        {recentActivities.map((activity, index) => {
          const Icon = getIcon(activity.icon as string);
          return (
            <Link to={activity.path} key={index} className="flex items-center gap-4 group">
              <div className="p-2 bg-muted rounded-md">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none group-hover:underline">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.type}</p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  const renderFavoriteList = () => {
    if (isLoadingFavorites) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      );
    }
    if (!favorites || favorites.length === 0) {
      return <p className="text-sm text-muted-foreground text-center py-4">Você ainda não tem favoritos. Clique na estrela <Star className="h-3 w-3 inline-block" /> para adicionar.</p>;
    }
    return (
      <div className="space-y-4">
        {favorites.map((fav) => {
          const Icon = getIcon(fav.item_type);
          return (
            <Link to={fav.item_id} key={fav.item_id} className="flex items-center gap-4 group">
              <div className="p-2 bg-muted rounded-md">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none group-hover:underline">{fav.item_title}</p>
                <p className="text-xs text-muted-foreground">{fav.item_type}</p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bem-vindo(a) de volta, {profile?.username || "Usuário"}!</h1>
          <p className="text-muted-foreground">Aqui está um resumo da sua atividade e atalhos.</p>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
          <AvatarFallback>{profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickAccessItems.map(item => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="hover:shadow-lg transition-shadow">
              <Link to={item.path}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                  <div className={`p-2 rounded-full ${item.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground flex items-center">
                    Acessar agora <ArrowRight className="h-3 w-3 ml-1" />
                  </p>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <ActivityChart data={activities} />
        </div>

        {/* Side Cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              {renderActivityList()}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" />Meus Favoritos</CardTitle>
            </CardHeader>
            <CardContent>
              {renderFavoriteList()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
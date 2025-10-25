import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { FavoritesList } from "@/components/dashboard/FavoritesList";
import { QuickAccess } from "@/components/dashboard/QuickAccess";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { useUserActivity } from "@/hooks/useUserActivity";

export default function Dashboard() {
  const { userName, recentActivity, favorites, allActivity } = useUserActivity();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Bem-vindo(a) de volta, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Aqui está um resumo rápido da sua atividade e ferramentas.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <QuickAccess />
          <div className="mt-4">
            <ActivityChart data={allActivity} />
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <RecentActivityList items={recentActivity} />
          <FavoritesList items={favorites} />
        </div>
      </div>
    </div>
  );
}
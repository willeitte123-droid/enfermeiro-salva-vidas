import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/components/ThemeProvider';
import { Activity } from 'lucide-react';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityChartProps {
  data: { type: string; title: string; path: string; timestamp: string }[];
}

const processActivityData = (data: ActivityChartProps['data']): ActivityData[] => {
  const activityByDay: { [key: string]: number } = {};

  // Initialize the last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const formattedDate = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    activityByDay[formattedDate] = 0;
  }

  // Populate with user activity
  data.forEach(activity => {
    const activityDate = new Date(activity.timestamp);
    const formattedDate = activityDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (activityByDay.hasOwnProperty(formattedDate)) {
      activityByDay[formattedDate]++;
    }
  });

  return Object.keys(activityByDay).map(date => ({
    date,
    count: activityByDay[date],
  }));
};

export function ActivityChart({ data }: ActivityChartProps) {
  const { theme } = useTheme();
  const processedData = processActivityData(data);

  const colors = {
    light: { text: '#334155', fill: '#3b82f6' }, // slate-700, blue-500
    dark: { text: '#cbd5e1', fill: '#60a5fa' },  // slate-300, blue-400
  };
  const currentColors = theme === 'dark' ? colors.dark : colors.light;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Atividade nos Últimos 7 Dias
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={processedData}>
            <XAxis
              dataKey="date"
              stroke={currentColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={currentColors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#020817' : '#ffffff', // slate-950 or white
                borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0', // slate-800 or slate-200
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: currentColors.text }}
              formatter={(value) => [`${value} interações`, 'Atividade']}
            />
            <Bar dataKey="count" fill={currentColors.fill} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
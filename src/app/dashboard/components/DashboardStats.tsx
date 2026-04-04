interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 transition-all duration-250 ease-smooth hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-error'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${trend?.isPositive ? 'bg-success/10' : 'bg-primary/10'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  stats: {
    totalLinks: number;
    totalClicks: number;
    topPerforming: number;
    activeLinks: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards: StatCardProps[] = [
    {
      title: 'Total Links',
      value: stats.totalLinks,
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      trend: {
        value: 12,
        isPositive: true
      }
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
      trend: {
        value: 23,
        isPositive: true
      }
    },
    {
      title: 'Top Performing',
      value: stats.topPerforming,
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      trend: {
        value: 8,
        isPositive: true
      }
    },
    {
      title: 'Active Links',
      value: stats.activeLinks,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      trend: {
        value: 5,
        isPositive: true
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export default function MetricsCard({ title, value, icon, trend, subtitle }: MetricsCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm transition-all duration-250 ease-smooth hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="font-body text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="font-heading text-3xl font-semibold text-foreground">{value}</h3>
          {subtitle && (
            <p className="font-caption text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2">
          <span className={`font-caption text-sm font-medium ${trend.isPositive ? 'text-success' : 'text-error'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="font-caption text-xs text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
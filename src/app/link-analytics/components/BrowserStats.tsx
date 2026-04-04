interface BrowserData {
  browser: string;
  clicks: number;
  percentage: number;
  icon: string;
}

interface BrowserStatsProps {
  data: BrowserData[];
}

export default function BrowserStats({ data }: BrowserStatsProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Browser Distribution</h2>
      
      <div className="space-y-3">
        {data.map((browser, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-md transition-all duration-250 ease-smooth hover:bg-muted/50">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{browser.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-sm text-foreground">{browser.browser}</span>
                <span className="font-mono text-sm text-muted-foreground">{browser.percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-500 ease-smooth"
                  style={{ width: `${browser.percentage}%` }}
                ></div>
              </div>
            </div>
            <span className="font-mono text-sm text-foreground font-medium">{browser.clicks.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
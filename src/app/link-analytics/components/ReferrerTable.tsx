interface ReferrerData {
  source: string;
  clicks: number;
  percentage: number;
  icon: string;
}

interface ReferrerTableProps {
  data: ReferrerData[];
}

export default function ReferrerTable({ data }: ReferrerTableProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Traffic Sources</h2>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-body font-medium text-sm text-muted-foreground">Source</th>
              <th className="text-right py-3 px-4 font-body font-medium text-sm text-muted-foreground">Clicks</th>
              <th className="text-right py-3 px-4 font-body font-medium text-sm text-muted-foreground">Percentage</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-border last:border-0 transition-all duration-250 ease-smooth hover:bg-muted/50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{item.icon}</span>
                    </div>
                    <span className="font-body text-sm text-foreground">{item.source}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-mono text-sm text-foreground font-medium">{item.clicks.toLocaleString()}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-mono text-sm text-foreground">{item.percentage}%</span>
                </td>
                <td className="py-4 px-4">
                  <div className="w-full max-w-[100px] bg-muted rounded-full h-2 overflow-hidden ml-auto">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-smooth"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
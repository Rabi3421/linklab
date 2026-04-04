interface CountryData {
  country: string;
  clicks: number;
  percentage: number;
  flag: string;
}

interface GeographicDistributionProps {
  data: CountryData[];
}

export default function GeographicDistribution({ data }: GeographicDistributionProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Top Countries</h2>
      
      <div className="space-y-4">
        {data.map((country, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                <span className="font-body text-sm text-foreground">{country.country}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-foreground font-medium">{country.clicks.toLocaleString()}</span>
                <span className="font-mono text-sm text-muted-foreground w-12 text-right">{country.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-smooth"
                style={{ width: `${country.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-2 px-4 border border-border rounded-md font-body font-medium text-sm text-foreground transition-all duration-250 ease-smooth hover:bg-muted hover:-translate-y-[1px] active:scale-95">
        View All Countries
      </button>
    </div>
  );
}
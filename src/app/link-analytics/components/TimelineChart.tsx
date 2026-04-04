'use client';

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface TimelineDataPoint {
  date: string;
  clicks: number;
  uniqueVisitors: number;
}

interface TimelineChartProps {
  data: TimelineDataPoint[];
}

export default function TimelineChart({ data }: TimelineChartProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-semibold text-foreground">Click Timeline</h2>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground transition-all duration-250 ease-smooth hover:shadow-sm active:scale-95">
            7 Days
          </button>
          <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-foreground transition-all duration-250 ease-smooth hover:bg-muted/80 active:scale-95">
            30 Days
          </button>
          <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-foreground transition-all duration-250 ease-smooth hover:bg-muted/80 active:scale-95">
            90 Days
          </button>
        </div>
      </div>

      <div className="w-full h-80" aria-label="Click timeline chart showing daily click patterns">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="clicks" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              fill="url(#clicksGradient)"
              name="Total Clicks"
            />
            <Area 
              type="monotone" 
              dataKey="uniqueVisitors" 
              stroke="var(--color-accent)" 
              strokeWidth={2}
              fill="url(#visitorsGradient)"
              name="Unique Visitors"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="font-caption text-sm text-muted-foreground">Total Clicks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="font-caption text-sm text-muted-foreground">Unique Visitors</span>
        </div>
      </div>
    </div>
  );
}
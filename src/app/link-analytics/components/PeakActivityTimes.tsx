'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HourlyData {
  hour: string;
  clicks: number;
}

interface PeakActivityTimesProps {
  data: HourlyData[];
}

export default function PeakActivityTimes({ data }: PeakActivityTimesProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Peak Activity Times</h2>
      
      <div className="w-full h-64" aria-label="Bar chart showing peak activity times by hour">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="hour" 
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
            <Bar 
              dataKey="clicks" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
              name="Clicks"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-md">
            <p className="font-caption text-xs text-muted-foreground mb-1">Peak Hour</p>
            <p className="font-heading text-lg font-semibold text-foreground">2:00 PM - 3:00 PM</p>
          </div>
          <div className="p-4 bg-muted rounded-md">
            <p className="font-caption text-xs text-muted-foreground mb-1">Peak Day</p>
            <p className="font-heading text-lg font-semibold text-foreground">Wednesday</p>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DeviceData {
  name: string;
  value: number;
  color: string;
}

interface DeviceBreakdownProps {
  data: DeviceData[];
}

export default function DeviceBreakdown({ data }: DeviceBreakdownProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Device Breakdown</h2>
      
      <div className="w-full h-64" aria-label="Device breakdown pie chart showing visitor device types">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
        {data.map((device, index) => (
          <div key={index} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: device.color }}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-foreground truncate">{device.name}</p>
              <p className="font-mono text-xs text-muted-foreground">{device.value.toLocaleString()} clicks</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
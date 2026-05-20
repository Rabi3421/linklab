import type { BlogComparisonTable } from '../data';

interface ComparisonTableProps {
  table: BlogComparisonTable;
}

const YES_VALUES = new Set(['yes', 'true', '✓', '✅']);
const NO_VALUES = new Set(['no', 'false', '✗', '❌', 'none', 'n/a']);

function CellValue({ value }: { value: string }) {
  const lower = value.toLowerCase().trim();
  if (YES_VALUES.has(lower)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-sm">
        <span className="w-4 h-4 rounded-full bg-emerald-400/15 flex items-center justify-center text-[10px]">✓</span>
        Yes
      </span>
    );
  }
  if (NO_VALUES.has(lower)) {
    return (
      <span className="inline-flex items-center gap-1.5 text-white/30 text-sm">
        <span className="w-4 h-4 rounded-full bg-white/05 flex items-center justify-center text-[10px]">✗</span>
        No
      </span>
    );
  }
  return <span className="font-body text-sm text-white/65">{value}</span>;
}

export default function ComparisonTable({ table }: ComparisonTableProps) {
  return (
    <div className="not-prose">
      <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(200,205,220,0.12)' }}>
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr style={{ background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(200,205,220,0.12)' }}>
              {table.headers.map((header, i) => (
                <th
                  key={header}
                  className={`font-heading font-semibold text-xs uppercase tracking-[0.14em] text-amber-300/80 px-4 py-3.5 ${i === 0 ? 'min-w-[140px]' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                style={{
                  background: rowIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderBottom: rowIdx < table.rows.length - 1 ? '1px solid rgba(200,205,220,0.07)' : 'none',
                }}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className={`px-4 py-3.5 align-middle ${cellIdx === 0 ? 'font-heading font-semibold text-sm text-white/80' : ''}`}
                  >
                    {cellIdx === 0 ? cell : <CellValue value={cell} />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.caption && (
        <p className="font-body text-xs text-white/35 mt-2 px-1">{table.caption}</p>
      )}
    </div>
  );
}

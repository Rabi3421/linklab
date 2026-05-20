import Icon from '@/components/ui/AppIcon';
import type { BlogCallout, CalloutVariant } from '../data';

interface CalloutConfig {
  label: string;
  iconName: string;
  borderColor: string;
  bgColor: string;
  labelColor: string;
  iconColor: string;
}

const CALLOUT_CONFIG: Record<CalloutVariant, CalloutConfig> = {
  tip: {
    label: 'Tip',
    iconName: 'LightBulbIcon',
    borderColor: 'rgba(52,211,153,0.35)',
    bgColor: 'rgba(52,211,153,0.06)',
    labelColor: 'text-emerald-300',
    iconColor: 'text-emerald-400',
  },
  warning: {
    label: 'Warning',
    iconName: 'ExclamationTriangleIcon',
    borderColor: 'rgba(251,191,36,0.35)',
    bgColor: 'rgba(251,191,36,0.06)',
    labelColor: 'text-amber-300',
    iconColor: 'text-amber-400',
  },
  example: {
    label: 'Example',
    iconName: 'CodeBracketIcon',
    borderColor: 'rgba(99,102,241,0.35)',
    bgColor: 'rgba(99,102,241,0.06)',
    labelColor: 'text-indigo-300',
    iconColor: 'text-indigo-400',
  },
  'best-practice': {
    label: 'Best Practice',
    iconName: 'SparklesIcon',
    borderColor: 'rgba(168,85,247,0.35)',
    bgColor: 'rgba(168,85,247,0.06)',
    labelColor: 'text-purple-300',
    iconColor: 'text-purple-400',
  },
  mistake: {
    label: 'Common Mistake',
    iconName: 'XCircleIcon',
    borderColor: 'rgba(239,68,68,0.35)',
    bgColor: 'rgba(239,68,68,0.06)',
    labelColor: 'text-red-300',
    iconColor: 'text-red-400',
  },
  'seo-note': {
    label: 'SEO Note',
    iconName: 'MagnifyingGlassIcon',
    borderColor: 'rgba(56,189,248,0.35)',
    bgColor: 'rgba(56,189,248,0.06)',
    labelColor: 'text-sky-300',
    iconColor: 'text-sky-400',
  },
};

interface CalloutBoxProps {
  callout: BlogCallout;
}

export default function CalloutBox({ callout }: CalloutBoxProps) {
  const config = CALLOUT_CONFIG[callout.variant];

  return (
    <div
      className="rounded-2xl p-5 flex gap-4"
      style={{
        background: config.bgColor,
        borderLeft: `3px solid ${config.borderColor}`,
        border: `1px solid ${config.borderColor}`,
        borderLeftWidth: '3px',
      }}
    >
      <div className="flex-shrink-0 pt-0.5">
        <Icon name={config.iconName} size={20} variant="outline" className={config.iconColor} />
      </div>
      <div className="min-w-0">
        <div className={`font-body text-xs font-semibold uppercase tracking-[0.14em] mb-1.5 ${config.labelColor}`}>
          {config.label}
        </div>
        {callout.title && (
          <p className="font-heading font-semibold text-sm text-white/80 mb-1">{callout.title}</p>
        )}
        <p className="font-body text-sm leading-relaxed text-white/60">{callout.body}</p>
      </div>
    </div>
  );
}

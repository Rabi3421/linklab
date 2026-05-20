import type { BlogStepItem } from '../data';

interface StepCardsProps {
  steps: BlogStepItem[];
}

export default function StepCards({ steps }: StepCardsProps) {
  return (
    <ol className="space-y-4 list-none p-0 m-0">
      {steps.map((step, idx) => (
        <li key={step.number} className="flex gap-4 items-start">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-sm text-[#1e2129]"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', marginTop: '1px' }}
            aria-label={`Step ${step.number}`}
          >
            {step.number}
          </div>

          <div
            className="flex-1 rounded-2xl px-5 py-4"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,205,220,0.10)',
            }}
          >
            {/* Connector line except on last item */}
            <div className="relative">
              {idx < steps.length - 1 && (
                <div
                  className="absolute left-[-28px] top-[36px] w-px"
                  style={{
                    height: 'calc(100% + 16px)',
                    background: 'linear-gradient(to bottom, rgba(245,158,11,0.25), transparent)',
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
            <p className="font-heading font-semibold text-base text-white/88 mb-1.5">{step.heading}</p>
            <p className="font-body text-sm leading-relaxed text-white/55">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

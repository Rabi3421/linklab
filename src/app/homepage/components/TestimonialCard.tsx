import AppImage from '@/components/ui/AppImage';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  image: string;
  alt: string;
  testimonial: string;
  metric?: string;
  metricLabel?: string;
}

const TestimonialCard = ({ name, role, company, image, alt, testimonial, metric, metricLabel }: TestimonialCardProps) => {
  return (
    <div
      className="rounded-2xl p-7 flex flex-col gap-5 transition-all duration-350 hover:-translate-y-1"
      style={{ background: '#252830', border: '1px solid rgba(200,205,220,0.14)' }}
    >
      {/* Quote mark */}
      <div className="text-blue-500/30 font-heading font-bold text-5xl leading-none select-none">"</div>

      <p className="font-body text-white/65 text-base leading-relaxed flex-1">
        {testimonial}
      </p>

      {metric && (
          <div className="px-4 py-3 rounded-xl bg-white/4 border border-white/10">
          <div className="font-heading font-bold text-2xl text-white">{metric}</div>
          <div className="font-body text-xs text-white/40 mt-0.5">{metricLabel}</div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-white/10">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/15">
          <AppImage
            src={image}
            alt={alt}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-heading font-semibold text-sm text-white">{name}</div>
          <div className="font-body text-xs text-white/40">{role} · {company}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
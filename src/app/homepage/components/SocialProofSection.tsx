import TestimonialCard from './TestimonialCard';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  alt: string;
  testimonial: string;
  metric?: string;
  metricLabel?: string;
}

const SocialProofSection = () => {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Mitchell',
      role: 'Marketing Director',
      company: 'TechFlow Inc',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ffde516e-1763293580273.png",
      alt: 'Professional woman with long brown hair in navy blazer smiling at camera in modern office',
      testimonial: 'LinkLab transformed how we track our marketing campaigns. The analytics are incredibly detailed and the custom aliases help maintain our brand consistency across all channels.',
      metric: '3.2×',
      metricLabel: 'click-through rate'
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer',
      company: 'StartupHub',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_15be4265d-1763301291596.png",
      alt: 'Asian man with short black hair in white shirt smiling confidently in bright office setting',
      testimonial: 'The API integration was seamless. We automated our entire link generation process and the documentation made implementation straightforward. Highly recommend for developers.',
      metric: '40hrs',
      metricLabel: 'saved per month'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Social Media Manager',
      company: 'BrandVibe',
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a36548bd-1763296665300.png",
      alt: 'Hispanic woman with curly dark hair in red blouse smiling warmly in creative workspace',
      testimonial: 'Managing hundreds of social media links used to be a nightmare. LinkLab\'s dashboard makes it easy to organize, track, and optimize all our campaigns in one place.',
      metric: '98%',
      metricLabel: 'team adoption rate'
    }
  ];

  const stats = [
    { value: '10M+', label: 'Links Created', sublabel: 'and counting' },
    { value: '500K+', label: 'Active Users', sublabel: 'across 150 countries' },
    { value: '99.9%', label: 'Uptime', sublabel: 'guaranteed SLA' },
    { value: '<50ms', label: 'Redirect Speed', sublabel: 'global average' }
  ];

  const logos = ['TechFlow', 'StartupHub', 'BrandVibe', 'Nexus Co', 'Orbit Labs', 'Pulse Media'];

  return (
    <section className="relative overflow-hidden" style={{ background: '#1e2129' }}>
      <style jsx>{`
        @keyframes meshShift2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-15px, 20px) rotate(-1deg); }
          66% { transform: translate(20px, -10px) rotate(0.5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .social-mesh { animation: meshShift2 20s ease-in-out infinite; }
        .marquee-track { animation: marquee 20s linear infinite; }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
        }
        .glass-stat {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
          backdrop-filter: blur(8px);
        }
      `}</style>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none z-0" />

      {/* Mesh gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-0 social-mesh"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 20% 30%, rgba(245,158,11,0.05) 0%, transparent 60%),
                       radial-gradient(ellipse 45% 55% at 80% 70%, rgba(99,102,241,0.06) 0%, transparent 60%),
                       radial-gradient(ellipse 35% 35% at 50% 10%, rgba(239,68,68,0.04) 0%, transparent 60%)`,
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Stats band */}
      <div className="relative z-10" style={{ borderTop: '1px solid rgba(200,205,220,0.12)', borderBottom: '1px solid rgba(200,205,220,0.12)' }}>
        <div className="py-12">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
              {stats.map((stat, i) => (
                <div key={i} className={`text-center lg:px-8 ${i > 0 ? 'lg:border-l lg:border-white/8' : ''}`}>
                  <div
                    className="font-heading font-bold text-4xl lg:text-5xl mb-1"
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ef4444 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-body text-base font-semibold text-white/70">{stat.label}</div>
                  <div className="font-body text-xs text-white/30 mt-0.5">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logo marquee */}
      <div className="relative z-10 py-10" style={{ borderBottom: '1px solid rgba(200,205,220,0.12)' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-xs text-white/25 uppercase tracking-widest text-center mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((logo, i) => (
              <span key={i} className="font-heading font-bold text-lg text-white/20 tracking-tight hover:text-amber-400/50 transition-colors duration-250 cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="font-body text-sm font-semibold text-amber-400 uppercase tracking-widest mb-3">Customer stories</p>
            <h2 className="font-heading font-bold text-4xl lg:text-5xl text-white leading-tight">
              Real results from real teams
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={i}
                name={t.name}
                role={t.role}
                company={t.company}
                image={t.image}
                alt={t.alt}
                testimonial={t.testimonial}
                metric={t.metric}
                metricLabel={t.metricLabel}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
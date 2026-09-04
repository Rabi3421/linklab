import Icon from '@/components/ui/AppIcon';

const trustBadges = [
  {
    icon: 'MapPinIcon',
    title: 'Built for India-first teams',
    detail: 'Straightforward INR pricing with plans for individuals, growing teams, and agencies.',
  },
  {
    icon: 'ShieldCheckIcon',
    title: 'SSL on every link',
    detail: 'Secure HTTPS destinations and redirects are part of the platform by default.',
  },
  {
    icon: 'CreditCardIcon',
    title: 'No credit card required',
    detail: 'Start on the free plan and explore the core URL-shortening workflow first.',
  },
  {
    icon: 'BoltIcon',
    title: 'No-expiry credit packs',
    detail: 'Buy one-time link credits for occasional campaigns without another subscription.',
  },
] as const;

export default function SocialProofSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#1e2129] py-16">
      {/* TODO: replace with real metrics once available. */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-widest text-amber-400">
            Built on practical promises
          </p>
          <h2 className="font-heading text-3xl font-bold text-white lg:text-4xl">
            What you can expect from LinkLab
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
                <Icon name={badge.icon} size={20} variant="solid" className="text-amber-400" />
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-white/85">{badge.title}</h3>
              <p className="font-body text-sm leading-relaxed text-white/45">{badge.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { comparisonData } from '@/lib/marketing/comparison';

export default function HomepageComparisonSection() {
  return (
    <section className="relative overflow-hidden bg-[#181b22] py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_0%,rgba(245,158,11,0.07),transparent_65%)]" />

      <div className="relative z-10 mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-[680px] text-center">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-widest text-amber-400">
            LinkLab vs Bitly
          </p>
          <h2 className="mb-4 font-heading text-4xl font-bold leading-tight text-white lg:text-5xl">
            Compare the free-plan essentials
          </h2>
          <p className="font-body text-lg leading-relaxed text-white/48">
            A quick view of the limits and redirect experience that matter before you choose a URL shortener.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <div className="grid grid-cols-[1.25fr_1fr_1fr] border-b border-white/10 bg-white/[0.03] px-5 py-4 sm:px-7">
            <div className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-white/35">Feature</div>
            <div className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">LinkLab</div>
            <div className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Bitly free</div>
          </div>

          {comparisonData.map((row, index) => (
            <div
              key={row.feature}
              className="grid grid-cols-[1.25fr_1fr_1fr] items-center px-5 py-4 text-sm sm:px-7"
              style={{ borderBottom: index === comparisonData.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="pr-4 font-body font-medium text-white/72">{row.feature}</div>
              <div className="flex items-start gap-2 pr-4 font-body text-white/68">
                {row.linkLabPositive ? (
                  <Icon name="CheckCircleIcon" size={16} variant="solid" className="mt-0.5 shrink-0 text-emerald-400" />
                ) : null}
                <span>{row.linkLab}</span>
              </div>
              <div className="font-body text-white/42">{row.bitly}</div>
            </div>
          ))}
        </div>

        <div className="mt-7 text-center">
          <Link
            href="/blog/best-bitly-alternatives"
            className="inline-flex items-center gap-2 font-body text-sm font-semibold text-amber-300/80 transition-colors hover:text-amber-300"
          >
            Read the full Bitly alternatives comparison
            <Icon name="ArrowRightIcon" size={15} variant="outline" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import CTASection from '@/app/homepage/components/CTASection';
import Footer from '@/app/homepage/components/Footer';
import Icon from '@/components/ui/AppIcon';
import { getAllBlogPosts } from './data';
import { absoluteUrl, defaultOgImage, siteUrl } from '@/lib/seo/site';

const blogUrl = absoluteUrl('/blog');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Blog - LinkLab Insights on Analytics, SEO, and Growth',
  description:
    'Read practical LinkLab articles on URL analytics, campaign measurement, and growth workflows. Explore SEO-friendly, people-first insights for modern marketing teams.',
  alternates: {
    canonical: blogUrl,
  },
  openGraph: {
    title: 'Blog - LinkLab Insights on Analytics, SEO, and Growth',
    description:
      'Read practical LinkLab articles on URL analytics, campaign measurement, and growth workflows.',
    url: blogUrl,
    siteName: 'LinkLab',
    type: 'website',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'LinkLab blog for URL shortener analytics and growth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - LinkLab Insights on Analytics, SEO, and Growth',
    description:
      'Practical articles on URL analytics, campaign measurement, and growth workflows.',
    images: [defaultOgImage],
  },
};

const noiseOverlayStyle = {
  backgroundImage:
    'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
  opacity: 0.022,
} as const;

const glassCardStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
  border: '1px solid rgba(200,205,220,0.14)',
  backdropFilter: 'blur(18px)',
} as const;

const glassCardSoftStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
  border: '1px solid rgba(200,205,220,0.12)',
  backdropFilter: 'blur(14px)',
} as const;

const labelChipStyle = {
  background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(239,68,68,0.08) 100%)',
  border: '1px solid rgba(245,158,11,0.24)',
} as const;

const sectionDividerStyle = {
  borderTop: '1px solid rgba(200,205,220,0.10)',
} as const;

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const featuredPost = posts[0];

  return (
    <>
      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[72px] text-white">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0" style={noiseOverlayStyle} />
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 60% 55% at 18% 20%, rgba(245,158,11,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 45% 50% at 82% 16%, rgba(99,102,241,0.08) 0%, transparent 60%),
                           radial-gradient(ellipse 38% 42% at 50% 82%, rgba(239,68,68,0.05) 0%, transparent 60%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,205,220,0.35) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 lg:pt-32 lg:pb-28">
            <div className="max-w-[900px]">
              <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8" style={labelChipStyle}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/80">
                  LinkLab blog
                </span>
              </div>

              <h1 className="font-heading text-5xl lg:text-7xl font-bold leading-[1.02] tracking-[-0.04em] mb-6">
                Helpful articles for teams
                <span className="block bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  that care about better link decisions.
                </span>
              </h1>

              <p className="max-w-[760px] font-body text-lg lg:text-xl leading-relaxed text-white/58 mb-10">
                Our blog is built around people-first, SEO-friendly content: practical topics, clear headings, real decision-making advice, and content designed to be useful even if someone lands here directly from search.
              </p>
            </div>

            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="block rounded-[32px] p-6 lg:p-8 transition-transform duration-300 hover:-translate-y-1" style={glassCardStyle}>
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] text-amber-200" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.24)' }}>
                        Featured article
                      </span>
                      <span className="font-body text-sm text-white/38">{featuredPost.category}</span>
                    </div>
                    <h2 className="font-heading text-3xl lg:text-5xl font-bold leading-tight mb-4">{featuredPost.title}</h2>
                    <p className="font-body text-lg leading-relaxed text-white/56 mb-6">{featuredPost.description}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/42">
                      <span>{featuredPost.author}</span>
                      <span>{featuredPost.publishedAt}</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <div className="rounded-[28px] p-6 lg:p-7" style={glassCardSoftStyle}>
                    <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-3">Why it matters</div>
                    <div className="font-heading text-5xl font-bold mb-4">{featuredPost.heroStat}</div>
                    <div className="space-y-3">
                      {featuredPost.takeaways.slice(0, 3).map((takeaway) => (
                        <div key={takeaway} className="flex items-start gap-3">
                          <Icon name="CheckCircleIcon" size={18} variant="solid" className="text-emerald-400 mt-0.5" />
                          <span className="font-body text-sm leading-relaxed text-white/54">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden py-24 lg:py-28" style={sectionDividerStyle}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[620px] mb-14">
              <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber-400 mb-3">Latest posts</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">Browse articles in card format</h2>
              <p className="font-body text-lg text-white/52 leading-relaxed">
                Each post is designed to be readable, searchable, and useful for growth, analytics, and campaign teams.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="rounded-[28px] p-6 transition-transform duration-300 hover:-translate-y-1"
                  style={glassCardStyle}
                >
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] text-amber-200" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.24)' }}>
                      {post.category}
                    </span>
                    <span className="font-body text-xs text-white/35">{post.readTime}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold leading-tight mb-3">{post.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-white/54 mb-5">{post.description}</p>
                  <div className="flex items-center justify-between gap-3 text-sm text-white/40">
                    <span>{post.author}</span>
                    <span className="inline-flex items-center gap-2 text-amber-300/85">
                      Read article
                      <Icon name="ArrowRightIcon" size={16} variant="outline" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
        <Footer />
      </main>
    </>
  );
}

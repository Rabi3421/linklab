import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import CTASection from '@/app/homepage/components/CTASection';
import Footer from '@/app/homepage/components/Footer';
import FAQItem from '@/app/homepage/components/FAQItem';
import Icon from '@/components/ui/AppIcon';
import { getAllBlogPosts, getBlogPostBySlug } from '../data';

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog article not found - LinkLab',
    };
  }

  return {
    title: `${post.title} | LinkLab Blog`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

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

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LinkLab',
    },
    keywords: post.keywords.join(', '),
  };

  return (
    <>
      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[72px] text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

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

          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 lg:pt-32 lg:pb-24">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px] items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/42 hover:text-amber-300 transition-colors duration-200">
                    <Icon name="ArrowLeftIcon" size={16} variant="outline" />
                    Back to blog
                  </Link>

                  <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5" style={labelChipStyle}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-amber-300/80">
                      {post.coverLabel}
                    </span>
                  </div>
                </div>

                <div className="max-w-[860px]">
                  <h1 className="font-heading text-4xl lg:text-6xl xl:text-7xl font-bold leading-[1.02] tracking-[-0.04em] mb-6">
                    {post.title}
                  </h1>

                  <p className="font-body text-lg lg:text-2xl leading-relaxed text-white/58 mb-8 max-w-[780px]">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/42 mb-10">
                    <span>{post.author}</span>
                    <span>{post.authorRole}</span>
                    <span>{post.publishedAt}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="rounded-[30px] p-6 lg:p-8" style={glassCardStyle}>
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] items-start">
                    <div>
                      <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-3">Why readers save this article</div>
                      <div className="font-heading text-4xl lg:text-5xl font-bold leading-tight mb-5">{post.heroStat}</div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {post.takeaways.map((takeaway) => (
                          <div key={takeaway} className="flex items-start gap-3 rounded-2xl px-4 py-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,205,220,0.10)' }}>
                            <Icon name="CheckCircleIcon" size={18} variant="solid" className="text-emerald-400 mt-0.5" />
                            <span className="font-body text-sm leading-relaxed text-white/56">{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-3xl p-5 lg:p-6" style={glassCardSoftStyle}>
                      <div className="font-body text-xs uppercase tracking-[0.16em] text-amber-300/75 mb-4">SEO notes</div>
                      <div className="space-y-3 text-sm text-white/54">
                        <p>Descriptive title with a clear benefit.</p>
                        <p>People-first content focused on one audience problem.</p>
                        <p>Scannable section headings and substantial, original explanation.</p>
                        <p>Article metadata and structured data for better search understanding.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="hidden xl:block xl:sticky xl:top-[108px] space-y-4">
                <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
                  <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-4">Article details</div>
                  <div className="space-y-3 text-sm text-white/54">
                    <p><span className="text-white/35">Category:</span> {post.category}</p>
                    <p><span className="text-white/35">Published:</span> {post.publishedAt}</p>
                    <p><span className="text-white/35">Updated:</span> {post.updatedAt}</p>
                    <p><span className="text-white/35">Reading time:</span> {post.readTime}</p>
                  </div>
                </div>

                <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
                  <div className="font-body text-xs uppercase tracking-[0.16em] text-amber-300/75 mb-4">Primary keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.map((keyword) => (
                      <span key={keyword} className="px-3 py-1.5 rounded-full text-xs text-white/60" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.10)' }}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 lg:py-24" style={sectionDividerStyle}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 xl:grid-cols-[minmax(0,820px)_320px] items-start justify-between">
            <article className="space-y-8 min-w-0">
              <div className="rounded-[28px] p-6 lg:p-8" style={glassCardStyle}>
                <div className="space-y-5">
                  {post.intro.map((paragraph) => (
                    <p key={paragraph} className="font-body text-base lg:text-lg leading-8 text-white/60">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {post.sections.map((section) => (
                <section key={section.title} className="rounded-[28px] p-6 lg:p-8" style={glassCardStyle}>
                  <h2 className="font-heading text-3xl font-bold mb-5">{section.title}</h2>
                  <div className="space-y-5">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="font-body text-base lg:text-lg leading-8 text-white/60">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && (
                      <div className="space-y-3 pt-2">
                        {section.bullets.map((bullet) => (
                          <div key={bullet} className="flex items-start gap-3">
                            <Icon name="CheckCircleIcon" size={18} variant="solid" className="text-emerald-400 mt-1" />
                            <span className="font-body text-base leading-7 text-white/58">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              ))}

              <section className="rounded-[28px] p-6 lg:p-8" style={glassCardStyle}>
                <h2 className="font-heading text-3xl font-bold mb-5">Frequently asked questions</h2>
                <div className="space-y-3">
                  {post.faqs.map((faq) => (
                    <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </section>
            </article>

            <aside className="xl:sticky xl:top-[108px] space-y-4">
              <div className="rounded-3xl p-5 lg:p-6" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-4">Article details</div>
                <div className="space-y-3 text-sm text-white/54">
                  <p><span className="text-white/35">Category:</span> {post.category}</p>
                  <p><span className="text-white/35">Published:</span> {post.publishedAt}</p>
                  <p><span className="text-white/35">Updated:</span> {post.updatedAt}</p>
                  <p><span className="text-white/35">Reading time:</span> {post.readTime}</p>
                </div>
              </div>

              <div className="rounded-3xl p-5 lg:p-6" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.16em] text-amber-300/75 mb-4">Primary keywords</div>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.map((keyword) => (
                    <span key={keyword} className="px-3 py-1.5 rounded-full text-xs text-white/60" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.10)' }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl p-5 lg:p-6" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-4">In this article</div>
                <div className="space-y-2">
                  {post.sections.slice(0, 6).map((section) => (
                    <p key={section.title} className="font-body text-sm text-white/52 leading-relaxed">
                      {section.title}
                    </p>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <CTASection />
        <Footer />
      </main>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import CTASection from '@/app/homepage/components/CTASection';
import Footer from '@/app/homepage/components/Footer';
import FAQItem from '@/app/homepage/components/FAQItem';
import Icon from '@/components/ui/AppIcon';
import { getAllBlogPosts, getBlogPostBySlug } from '../data';
import type { BlogSection } from '../data';
import { absoluteUrl, defaultOgImage, siteUrl } from '@/lib/seo/site';
import { blogMetadata } from '../blog-metadata';
import CalloutBox from '../components/CalloutBox';
import ComparisonTable from '../components/ComparisonTable';
import StepCards from '../components/StepCards';
import BlogImage from '../components/BlogImage';
import RelatedPosts from '../components/RelatedPosts';

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

/** Convert a section title to a URL-safe anchor ID */
const toAnchorId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Blog article not found - LinkLab' };
  }

  const meta = blogMetadata[slug] ?? {};
  const articleUrl = absoluteUrl(`/blog/${post.slug}`);
  const ogImageUrl = meta.featuredImage?.src
    ? absoluteUrl(meta.featuredImage.src)
    : defaultOgImage;
  const metaTitle = meta.metaTitle ?? `${post.title} | LinkLab Blog`;

  return {
    metadataBase: new URL(siteUrl),
    title: metaTitle,
    description: post.description,
    keywords: [...post.keywords, ...(meta.tags ?? [])],
    alternates: { canonical: articleUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: articleUrl,
      siteName: 'LinkLab',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [
        {
          url: ogImageUrl,
          width: meta.featuredImage?.width ?? 1200,
          height: meta.featuredImage?.height ?? 630,
          alt: meta.featuredImage?.alt ?? post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

// ─── Design tokens ─────────────────────────────────────────────────────────
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

// ─── Section renderer ──────────────────────────────────────────────────────
function SectionBody({ section }: { section: BlogSection }) {
  const hasContent =
    section.paragraphs.length > 0 || section.bullets || section.steps || section.table || section.callout || section.cta || section.image;

  if (!hasContent) return null;

  return (
    <div className="space-y-5">
      {/* Paragraphs */}
      {section.paragraphs.map((paragraph, i) => (
        <p key={i} className="font-body text-base lg:text-lg leading-8 text-white/60">
          {paragraph}
        </p>
      ))}

      {/* Inline image (after paragraphs, before bullets) */}
      {section.image && (
        <BlogImage
          src={section.image.src}
          alt={section.image.alt}
          caption={section.image.caption}
          width={section.image.width}
          height={section.image.height}
          priority={section.image.priority}
          className="my-2"
        />
      )}

      {/* Bullets */}
      {section.bullets && (
        <div className="space-y-3 pt-2">
          {section.bullets.map((bullet, i) => (
            <div key={i} className="flex items-start gap-3">
              <Icon name="CheckCircleIcon" size={18} variant="solid" className="text-emerald-400 mt-1 flex-shrink-0" />
              <span className="font-body text-base leading-7 text-white/58">{bullet}</span>
            </div>
          ))}
        </div>
      )}

      {/* Comparison table */}
      {section.table && <ComparisonTable table={section.table} />}

      {/* Step cards */}
      {section.steps && <StepCards steps={section.steps} />}

      {/* Callout box */}
      {section.callout && <CalloutBox callout={section.callout} />}

      {/* Inline CTA */}
      {section.cta && (
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(239,68,68,0.07) 100%)',
            border: '1px solid rgba(245,158,11,0.22)',
          }}
        >
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-base text-white/90">{section.cta.heading}</p>
            {section.cta.subtext && (
              <p className="font-body text-sm text-white/50 mt-0.5">{section.cta.subtext}</p>
            )}
          </div>
          <Link
            href={section.cta.href}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-semibold text-sm text-[#1e2129] transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' }}
          >
            {section.cta.buttonLabel}
            <Icon name="ArrowRightIcon" size={14} variant="outline" />
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const meta = blogMetadata[slug] ?? {};
  const relatedSlugs = meta.relatedPosts ?? post.relatedPosts ?? [];
  const featuredImage = meta.featuredImage ?? post.featuredImage;
  const articleUrl = absoluteUrl(`/blog/${post.slug}`);
  const ogImageUrl = featuredImage?.src ? absoluteUrl(featuredImage.src) : defaultOgImage;
  const metaTitle = meta.metaTitle ?? post.metaTitle ?? `${post.title} | LinkLab Blog`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    url: articleUrl,
    headline: metaTitle,
    description: post.description,
    image: ogImageUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author, jobTitle: post.authorRole },
    publisher: {
      '@type': 'Organization',
      name: 'LinkLab',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/favicon.png') },
    },
    keywords: post.keywords.join(', '),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: articleUrl },
    ],
  };

  return (
    <>
      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[72px] text-white">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        {/* ── Hero section ── */}
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
                {/* Breadcrumb + category */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-white/42 hover:text-amber-300 transition-colors duration-200"
                  >
                    <Icon name="ArrowLeftIcon" size={16} variant="outline" />
                    Back to blog
                  </Link>
                  <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5" style={labelChipStyle}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" aria-hidden="true" />
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
                    <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Key takeaways card */}
                <div className="rounded-[30px] p-6 lg:p-8" style={glassCardStyle}>
                  <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-3">
                    Why readers save this article
                  </div>
                  <div className="font-heading text-4xl lg:text-5xl font-bold leading-tight mb-5">
                    {post.heroStat}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {post.takeaways.map((takeaway, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-2xl px-4 py-4"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,205,220,0.10)' }}
                      >
                        <Icon name="CheckCircleIcon" size={18} variant="solid" className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="font-body text-sm leading-relaxed text-white/56">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop hero sidebar */}
              <aside className="hidden xl:block xl:sticky xl:top-[108px] space-y-4" aria-label="Article details">
                <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
                  <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-4">Article details</div>
                  <dl className="space-y-3 text-sm text-white/54">
                    <div className="flex justify-between gap-2">
                      <dt className="text-white/35">Category</dt>
                      <dd>{post.category}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-white/35">Published</dt>
                      <dd><time dateTime={post.publishedAt}>{post.publishedAt}</time></dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-white/35">Updated</dt>
                      <dd><time dateTime={post.updatedAt}>{post.updatedAt}</time></dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-white/35">Reading time</dt>
                      <dd>{post.readTime}</dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-3xl p-5" style={glassCardSoftStyle}>
                  <div className="font-body text-xs uppercase tracking-[0.16em] text-amber-300/75 mb-4">Topics</div>
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.slice(0, 6).map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1.5 rounded-full text-xs text-white/60"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.10)' }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── Article body ── */}
        <section className="relative overflow-hidden py-20 lg:py-24" style={sectionDividerStyle}>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 xl:grid-cols-[minmax(0,820px)_320px] items-start justify-between">

            {/* Main article column */}
            <article className="space-y-8 min-w-0">

              {/* Intro */}
              <div className="rounded-[28px] p-6 lg:p-8" style={glassCardStyle}>
                <div className="space-y-5">
                  {post.intro.map((paragraph, i) => (
                    <p key={i} className="font-body text-base lg:text-lg leading-8 text-white/60">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Content sections */}
              {post.sections.map((section) => {
                const anchorId = toAnchorId(section.title);
                const isCalloutOnly =
                  section.type === 'callout' &&
                  section.callout &&
                  section.paragraphs.length === 0 &&
                  !section.bullets &&
                  !section.steps &&
                  !section.table;

                if (isCalloutOnly) {
                  return (
                    <div key={anchorId} id={anchorId}>
                      <CalloutBox callout={section.callout!} />
                    </div>
                  );
                }

                return (
                  <section
                    key={anchorId}
                    id={anchorId}
                    className="rounded-[28px] p-6 lg:p-8"
                    style={glassCardStyle}
                    aria-labelledby={`${anchorId}-heading`}
                  >
                    <h2
                      id={`${anchorId}-heading`}
                      className="font-heading text-3xl font-bold mb-5"
                    >
                      {section.title}
                    </h2>
                    <SectionBody section={section} />
                  </section>
                );
              })}

              {/* FAQ section */}
              <section
                id="frequently-asked-questions"
                className="rounded-[28px] p-6 lg:p-8"
                style={glassCardStyle}
                aria-labelledby="faq-heading"
              >
                <h2 id="faq-heading" className="font-heading text-3xl font-bold mb-5">
                  Frequently asked questions
                </h2>
                <div className="space-y-3">
                  {post.faqs.map((faq) => (
                    <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </section>

              {/* Related posts */}
              {relatedSlugs.length > 0 && (
                <RelatedPosts slugs={relatedSlugs} currentSlug={slug} />
              )}
            </article>

            {/* Sticky sidebar */}
            <aside
              className="xl:sticky xl:top-[108px] space-y-4"
              aria-label="Article navigation"
            >
              {/* Article details */}
              <div className="rounded-3xl p-5 lg:p-6" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-4">
                  Article details
                </div>
                <dl className="space-y-3 text-sm text-white/54">
                  <div className="flex justify-between gap-2">
                    <dt className="text-white/35">Category</dt>
                    <dd>{post.category}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-white/35">Published</dt>
                    <dd><time dateTime={post.publishedAt}>{post.publishedAt}</time></dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-white/35">Updated</dt>
                    <dd><time dateTime={post.updatedAt}>{post.updatedAt}</time></dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-white/35">Reading time</dt>
                    <dd>{post.readTime}</dd>
                  </div>
                </dl>
              </div>

              {/* Topics */}
              <div className="rounded-3xl p-5 lg:p-6" style={glassCardSoftStyle}>
                <div className="font-body text-xs uppercase tracking-[0.16em] text-amber-300/75 mb-4">Topics</div>
                <div className="flex flex-wrap gap-2">
                  {post.keywords.slice(0, 6).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1.5 rounded-full text-xs text-white/60"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,205,220,0.10)' }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Table of contents — real anchor links */}
              {post.sections.length > 0 && (
                <nav
                  className="rounded-3xl p-5 lg:p-6"
                  style={glassCardSoftStyle}
                  aria-label="Table of contents"
                >
                  <div className="font-body text-xs uppercase tracking-[0.16em] text-white/35 mb-4">
                    In this article
                  </div>
                  <ol className="space-y-2 list-none p-0 m-0">
                    {post.sections.slice(0, 8).map((section) => {
                      const anchorId = toAnchorId(section.title);
                      return (
                        <li key={anchorId}>
                          <a
                            href={`#${anchorId}`}
                            className="font-body text-sm text-white/50 leading-relaxed hover:text-amber-300 transition-colors duration-150 block py-0.5"
                          >
                            {section.title}
                          </a>
                        </li>
                      );
                    })}
                    <li>
                      <a
                        href="#frequently-asked-questions"
                        className="font-body text-sm text-white/50 leading-relaxed hover:text-amber-300 transition-colors duration-150 block py-0.5"
                      >
                        Frequently asked questions
                      </a>
                    </li>
                  </ol>
                </nav>
              )}
            </aside>
          </div>
        </section>

        <CTASection />
        <Footer />
      </main>
    </>
  );
}

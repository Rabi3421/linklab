import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { getAllBlogPosts } from '../data';

interface RelatedPostsProps {
  slugs: string[];
  currentSlug: string;
}

const glassCardStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
  border: '1px solid rgba(200,205,220,0.12)',
} as const;

const categoryChipStyle = {
  background: 'rgba(245,158,11,0.10)',
  border: '1px solid rgba(245,158,11,0.20)',
} as const;

export default function RelatedPosts({ slugs, currentSlug }: RelatedPostsProps) {
  const allPosts = getAllBlogPosts();
  const related = slugs
    .filter((s) => s !== currentSlug)
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading">
      <div className="flex items-center gap-3 mb-5">
        <h2
          id="related-posts-heading"
          className="font-heading text-xl font-bold text-white"
        >
          Related articles
        </h2>
        <div
          className="h-px flex-1"
          style={{ background: 'rgba(200,205,220,0.10)' }}
          aria-hidden="true"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post!.slug}
            href={`/blog/${post!.slug}`}
            className="rounded-[22px] p-5 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={glassCardStyle}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.12em] text-amber-200"
                style={categoryChipStyle}
              >
                {post!.category}
              </span>
              <span className="font-body text-xs text-white/35 flex-shrink-0">{post!.readTime}</span>
            </div>

            <h3 className="font-heading font-semibold text-sm leading-snug text-white/82 flex-1">
              {post!.title}
            </h3>

            <div className="flex items-center gap-1.5 text-amber-300/75 text-xs font-body">
              <span>Read article</span>
              <Icon name="ArrowRightIcon" size={12} variant="outline" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

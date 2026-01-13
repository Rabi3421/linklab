import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react'
import { formatDate } from '@/lib/dateUtils'

export const metadata: Metadata = {
  title: 'Blog - URL Management Tips & Insights',
  description: 'Learn about URL optimization, link management best practices, marketing strategies, and the latest trends in digital marketing.',
  keywords: ['URL optimization', 'link management', 'digital marketing', 'SEO', 'marketing tips', 'link building'],
}

const blogPosts = [
  {
    id: 1,
    title: 'The Ultimate Guide to URL Shortening for Marketers',
    excerpt: 'Learn how to leverage URL shortening to improve your marketing campaigns, track performance, and increase engagement rates.',
    author: 'Sarah Johnson',
    publishedAt: '2024-12-20',
    readTime: '8 min read',
    category: 'Marketing',
    slug: 'ultimate-guide-url-shortening-marketers',
    featured: true
  },
  {
    id: 2,
    title: 'QR Codes in 2024: Best Practices and Use Cases',
    excerpt: 'Discover how QR codes are revolutionizing offline-to-online marketing and learn the best practices for implementation.',
    author: 'Michael Chen',
    publishedAt: '2024-12-18',
    readTime: '6 min read',
    category: 'Technology',
    slug: 'qr-codes-2024-best-practices',
    featured: false
  },
  {
    id: 3,
    title: 'UTM Parameters: A Complete Guide to Campaign Tracking',
    excerpt: 'Master UTM parameters to track your marketing campaigns effectively and make data-driven decisions.',
    author: 'Emily Rodriguez',
    publishedAt: '2024-12-15',
    readTime: '10 min read',
    category: 'Analytics',
    slug: 'utm-parameters-campaign-tracking-guide',
    featured: true
  },
  {
    id: 4,
    title: 'Link Security: Protecting Your URLs from Threats',
    excerpt: 'Learn about common link-based security threats and how to protect your URLs from malicious attacks.',
    author: 'David Kim',
    publishedAt: '2024-12-12',
    readTime: '7 min read',
    category: 'Security',
    slug: 'link-security-protecting-urls-threats',
    featured: false
  },
  {
    id: 5,
    title: 'The Psychology of Click-Worthy Links',
    excerpt: 'Understanding what makes users click on links and how to optimize your URLs for maximum engagement.',
    author: 'Lisa Thompson',
    publishedAt: '2024-12-10',
    readTime: '9 min read',
    category: 'Marketing',
    slug: 'psychology-click-worthy-links',
    featured: false
  },
  {
    id: 6,
    title: 'API Integration: Automating Your Link Management',
    excerpt: 'Learn how to integrate LinkLab API into your applications and automate your link management workflows.',
    author: 'Alex Turner',
    publishedAt: '2024-12-08',
    readTime: '12 min read',
    category: 'Development',
    slug: 'api-integration-automating-link-management',
    featured: false
  }
]

const categories = ['All', 'Marketing', 'Technology', 'Analytics', 'Security', 'Development']

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25" />
        
        <div className="container relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              LinkLab{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Insights, tips, and best practices for URL management, digital marketing, 
              and link optimization from industry experts.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b bg-background">
        <div className="container px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Featured Articles</h2>
            <p className="text-muted-foreground">Our most popular and insightful content</p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {featuredPosts.map((post) => (
              <article key={post.id} className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Tag className="mr-1 h-3 w-3" />
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">Featured</span>
                </div>
                
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors mb-3">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>By {post.author}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishedAt, { format: 'short' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                  >
                    Read more
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="container px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
          <p className="text-muted-foreground">Stay up to date with the latest insights and tips</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <article key={post.id} className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3">
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                  <Tag className="mr-1 h-3 w-3" />
                  {post.category}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-3">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div>By {post.author}</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishedAt, { format: 'short' })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-muted/30">
        <div className="container px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Stay in the loop</h2>
            <p className="mt-4 text-muted-foreground">
              Subscribe to our newsletter for the latest insights, tips, and updates from LinkLab.
            </p>
            
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-lg border bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
              />
              <button className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Subscribe
              </button>
            </div>
            
            <p className="mt-4 text-xs text-muted-foreground">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
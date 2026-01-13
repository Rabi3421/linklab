'use client'

import { ToolCard } from '@/components/ToolCard'
import { CTA } from '@/components/CTA'
import { 
  Link2, 
  QrCode, 
  BarChart3, 
  Target, 
  Globe, 
  Smartphone,
  Link,
  Layers,
  Database,
  Zap
} from 'lucide-react'

const tools = [
  {
    icon: Link2,
    title: 'URL Shortener',
    description: 'Create short, memorable links instantly. Perfect for social media, email campaigns, and marketing materials.',
    href: '/shorten',
    status: 'available' as const,
  },
  {
    icon: QrCode,
    title: 'QR Code Generator',
    description: 'Generate high-quality QR codes for your links. Customize colors, add logos, and download in multiple formats.',
    href: '/tools/qr-generator',
    status: 'coming-soon' as const,
  },
  {
    icon: Target,
    title: 'UTM Builder',
    description: 'Create UTM parameters for precise campaign tracking. Monitor performance across all marketing channels.',
    href: '/tools/utm-builder',
    status: 'coming-soon' as const,
  },
  {
    icon: BarChart3,
    title: 'Link Analytics',
    description: 'Detailed insights into your link performance. Track clicks, locations, devices, and referrer data.',
    href: '/tools/analytics',
    status: 'coming-soon' as const,
  },
  {
    icon: Smartphone,
    title: 'Link in Bio',
    description: 'Create beautiful, mobile-optimized landing pages perfect for social media profiles and campaigns.',
    href: '/tools/link-in-bio',
    status: 'coming-soon' as const,
  },
  {
    icon: Link,
    title: 'URL Expander',
    description: 'Safely expand shortened URLs to see where they lead before clicking. Check for malware and phishing.',
    href: '/tools/url-expander',
    status: 'coming-soon' as const,
  },
  {
    icon: Layers,
    title: 'Bulk Shortener',
    description: 'Shorten multiple URLs at once. Upload CSV files or paste multiple links for batch processing.',
    href: '/tools/bulk-shortener',
    status: 'coming-soon' as const,
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Use your own branded domain for short links. Increase trust and maintain brand consistency.',
    href: '/tools/custom-domains',
    status: 'coming-soon' as const,
  },
  {
    icon: Database,
    title: 'API Access',
    description: 'Integrate LinkLab into your applications with our comprehensive REST API and webhooks.',
    href: '/tools/api',
    status: 'coming-soon' as const,
  },
]

export default function ToolsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25" />
        
        <div className="container relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Complete Suite of{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                URL Tools
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Everything you need for URL management in one powerful platform. 
              From basic shortening to advanced analytics and team collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              status={tool.status}
            />
          ))}
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="bg-muted/30">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Zap className="h-4 w-4" />
              Rapid Development in Progress
            </div>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              More tools launching soon
            </h2>
            <p className="mt-4 text-muted-foreground">
              We're working around the clock to bring you the most comprehensive URL management platform. 
              New tools are being added every month based on user feedback and industry needs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA 
        title="Start with our URL shortener"
        description="While we're building more tools, you can start optimizing your links today with our powerful URL shortener."
        primaryText="Shorten Your First Link"
        primaryHref="/shorten"
      />
    </div>
  )
}
'use client'

import { Hero } from '@/components/Hero'
import { FeatureCard } from '@/components/FeatureCard'
import { CTA } from '@/components/CTA'
import { 
  Link2, 
  QrCode, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe,
  Users,
  Target,
  Smartphone
} from 'lucide-react'

const features = [
  {
    icon: Link2,
    title: 'URL Shortener',
    description: 'Create short, memorable links that are perfect for social media, email campaigns, and anywhere character count matters.',
  },
  {
    icon: QrCode,
    title: 'QR Code Generator',
    description: 'Generate high-quality QR codes for your links with customizable designs and colors for offline marketing campaigns.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Track clicks, geographic data, referrers, devices, and more with comprehensive real-time analytics and reporting.',
  },
  {
    icon: Target,
    title: 'UTM Builder',
    description: 'Create UTM parameters for precise campaign tracking and attribution across all your marketing channels.',
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Use your own branded domain for short links to maintain brand consistency and increase trust.',
  },
  {
    icon: Smartphone,
    title: 'Link in Bio',
    description: 'Create beautiful, mobile-optimized landing pages perfect for social media bio links and marketing campaigns.',
  },
]

const stats = [
  {
    icon: Users,
    value: '50K+',
    label: 'Active Users',
  },
  {
    icon: Link2,
    value: '10M+',
    label: 'Links Created',
  },
  {
    icon: Zap,
    value: '99.9%',
    label: 'Uptime',
  },
  {
    icon: Shield,
    value: '100%',
    label: 'Secure',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="border-t bg-muted/30">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything you need for 
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> URL management</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From simple link shortening to advanced analytics, LinkLab provides all the tools 
            you need to optimize your URLs and track their performance.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="bg-muted/30">
        <div className="container px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">More tools coming soon</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We're constantly expanding our toolkit. Here's what's on the roadmap:
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              'Bulk URL Processing',
              'Advanced API Access', 
              'Team Collaboration',
              'White-label Solutions'
            ].map((feature, index) => (
              <div key={feature} className="rounded-lg border border-dashed border-muted-foreground/25 bg-background/50 p-6 text-center">
                <div className="text-lg font-semibold">{feature}</div>
                <div className="mt-2 text-sm text-muted-foreground">Coming Q1 2025</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />
    </div>
  )
}

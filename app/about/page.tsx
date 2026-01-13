import type { Metadata } from 'next'
import { CTA } from '@/components/CTA'
import { Target, Users, Globe, Zap, Heart, Award, Lightbulb, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About LinkLab - Simplifying URL Management',
  description: 'Learn about LinkLab\'s mission to simplify URL management for marketers, developers, and businesses worldwide.',
  keywords: ['about linklab', 'URL management', 'company mission', 'team', 'link shortening'],
}

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously innovate to bring you the most advanced URL management tools.',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Your data and links are protected with enterprise-grade security measures.',
  },
  {
    icon: Heart,
    title: 'User-Centric',
    description: 'Every feature we build is designed with our users\' needs and feedback in mind.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Our platform serves users worldwide with reliable, fast infrastructure.',
  },
]

const milestones = [
  {
    year: '2023',
    title: 'Company Founded',
    description: 'LinkLab was founded with the vision of simplifying URL management.',
  },
  {
    year: '2024',
    title: 'URL Shortener Launch',
    description: 'Launched our core URL shortening service with advanced analytics.',
  },
  {
    year: '2024',
    title: 'Growing Community',
    description: 'Reached 50,000+ active users and 10M+ shortened links.',
  },
  {
    year: '2025',
    title: 'Comprehensive Suite',
    description: 'Expanding to a full suite of URL tools including QR codes, UTM builder, and more.',
  },
]

const team = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Co-founder',
    description: 'Former VP of Marketing at a Fortune 500 company, passionate about simplifying digital marketing tools.',
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-founder',
    description: 'Ex-Google engineer with 10+ years experience building scalable web platforms.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Product',
    description: 'Product strategist with expertise in user experience and growth analytics.',
  },
  {
    name: 'David Kim',
    role: 'Head of Engineering',
    description: 'Full-stack developer focused on performance, security, and developer experience.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25" />
        
        <div className="container relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Simplifying{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                URL Management
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              LinkLab was born from the frustration of using multiple tools for URL management. 
              We're building the comprehensive platform that brings everything together.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We believe that URL management should be simple, powerful, and accessible to everyone. 
                Our mission is to provide the most comprehensive and user-friendly URL tools that 
                empower marketers, developers, and businesses to optimize their digital presence.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From simple link shortening to advanced analytics and team collaboration, 
                we're building the platform that scales with your needs and grows with your business.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-2">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We envision a world where URL management is no longer a technical barrier but 
                an enabler of digital success. Where every link tells a story, every click provides 
                insights, and every campaign is optimized for maximum impact.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By 2025, we aim to be the go-to platform for URL management, serving millions 
                of users worldwide with innovative tools that make digital marketing more effective and measurable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30">
        <div className="container px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Our Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do at LinkLab
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="container px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Our Journey</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From a simple idea to a comprehensive URL management platform
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="mt-2 h-16 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-primary">{milestone.year}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <h3 className="font-semibold">{milestone.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/30">
        <div className="container px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Meet Our Team</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The passionate people building the future of URL management
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="rounded-lg border bg-card p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold sm:text-4xl">LinkLab by the Numbers</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Growing fast and serving users worldwide
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10M+</div>
              <div className="text-sm text-muted-foreground">Links Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-sm text-muted-foreground">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA 
        title="Ready to join our journey?"
        description="Be part of the LinkLab community and help us build the future of URL management."
      />
    </div>
  )
}
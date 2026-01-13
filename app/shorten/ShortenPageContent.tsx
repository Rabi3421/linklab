'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { UrlShortenerForm } from '@/components/UrlShortenerForm'
import { FeatureCard } from '@/components/FeatureCard'
import { Link2, BarChart3, QrCode, Shield, Zap, Share2 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get your shortened URL in milliseconds with our lightning-fast infrastructure.',
  },
  {
    icon: Shield,
    title: 'Secure Links',
    description: 'All links are protected with enterprise-grade security and malware scanning.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track clicks, geographic data, referrers, and devices in real-time.',
  },
  {
    icon: QrCode,
    title: 'QR Code Generation',
    description: 'Automatically generate QR codes for every shortened link for offline sharing.',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your links across social media, email, SMS, and any platform.',
  },
  {
    icon: Link2,
    title: 'Custom Aliases',
    description: 'Create memorable custom aliases that match your brand or campaign.',
  },
]

export function ShortenPageContent() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25" />
        
        <div className="container relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl"
            >
              Shorten Your URLs{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Instantly
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl"
            >
              Transform long, complex URLs into short, memorable links. Perfect for social media, 
              email campaigns, and anywhere character count matters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12"
            >
              <UrlShortenerForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Powerful features for 
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> link management</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our URL shortener comes packed with features to help you manage, 
            track, and optimize your links effectively.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30">
        <div className="container px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Why choose LinkLab?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of marketers, developers, and businesses who trust LinkLab
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold">No Registration Required</h3>
                  <p className="mt-2 text-muted-foreground">
                    Start shortening links immediately without creating an account. 
                    For advanced features, you can always sign up later.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">Enterprise-Grade Security</h3>
                  <p className="mt-2 text-muted-foreground">
                    All links are scanned for malware and phishing attempts. 
                    We maintain 99.9% uptime with global CDN distribution.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Detailed Analytics</h3>
                  <p className="mt-2 text-muted-foreground">
                    Get insights into who's clicking your links, when, and from where. 
                    Track performance across all your campaigns.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold">Custom Domains</h3>
                  <p className="mt-2 text-muted-foreground">
                    Use your own branded domain for short links to maintain 
                    brand consistency and increase click-through rates.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">API Access</h3>
                  <p className="mt-2 text-muted-foreground">
                    Integrate LinkLab into your applications with our robust API. 
                    Perfect for developers and automated workflows.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">Team Collaboration</h3>
                  <p className="mt-2 text-muted-foreground">
                    Share links and analytics with your team. Organize campaigns 
                    and manage permissions across your organization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
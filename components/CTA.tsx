'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

interface CTAProps {
  title?: string
  description?: string
  primaryText?: string
  secondaryText?: string
  primaryHref?: string
  secondaryHref?: string
}

export function CTA({
  title = "Ready to optimize your links?",
  description = "Join thousands of developers and marketers who trust LinkLab for their URL management needs.",
  primaryText = "Get Started Free",
  secondaryText = "View Pricing",
  primaryHref = "/shorten",
  secondaryHref = "/pricing"
}: CTAProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      
      <div className="container relative px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          {/* Description */}
          <p className="mt-6 text-lg text-blue-100 sm:text-xl">
            {description}
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-medium text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            >
              {primaryText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/20 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            >
              {secondaryText}
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-blue-200">
            No credit card required • Free forever plan available
          </p>
        </motion.div>
      </div>
    </section>
  )
}
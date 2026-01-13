'use client'

import type { Metadata } from 'next'
import * as React from 'react'
import { PricingCard } from '@/components/PricingCard'
import { Check, HelpCircle } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started',
    features: [
      '1,000 links per month',
      'Basic analytics (7 days)',
      'Standard short domains',
      'QR code generation',
      'Community support',
      'API access (100 requests/day)'
    ]
  },
  {
    name: 'Pro',
    price: { monthly: 19, yearly: 190 },
    description: 'For marketers and small teams',
    features: [
      '25,000 links per month',
      'Advanced analytics (90 days)',
      'Custom domains (3 included)',
      'Branded QR codes with logos',
      'UTM parameter builder',
      'Link expiry and password protection',
      'Priority email support',
      'API access (10,000 requests/day)',
      'Team collaboration (5 members)',
      'Export analytics data'
    ],
    isPopular: true
  },
  {
    name: 'Business',
    price: { monthly: 49, yearly: 490 },
    description: 'For growing businesses',
    features: [
      'Unlimited links',
      'Advanced analytics (unlimited)',
      'Custom domains (unlimited)',
      'White-label QR codes',
      'Advanced UTM tracking',
      'Link retargeting pixels',
      'A/B testing for links',
      'Priority phone & email support',
      'API access (100,000 requests/day)',
      'Team collaboration (unlimited)',
      'Advanced integrations',
      'Custom reporting dashboards',
      'SSO and advanced security'
    ]
  }
]

const faqs = [
  {
    question: 'Can I change my plan anytime?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades.'
  },
  {
    question: 'What happens if I exceed my link limit?',
    answer: 'If you exceed your monthly link limit, you can either upgrade your plan or wait until the next billing cycle. Your existing links will continue to work normally.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.'
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.'
  },
  {
    question: 'Can I use my own domain?',
    answer: 'Custom domains are available on Pro and Business plans. You can connect as many domains as your plan allows and use them for branded short links.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'Free plans get community support, Pro plans get priority email support, and Business plans get both priority email and phone support with dedicated account management.'
  }
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = React.useState(false)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25" />
        
        <div className="container relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Simple, transparent{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                pricing
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Start free and scale as you grow. No hidden fees, no surprises. 
              Cancel anytime with no questions asked.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:bg-primary"
                role="switch"
                aria-checked={isYearly}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Yearly
              </span>
              {isYearly && (
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Save up to 20%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              isYearly={isYearly}
            />
          ))}
        </div>
      </section>

      {/* Features Comparison */}
      <section className="bg-muted/30">
        <div className="container px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to succeed</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                All plans include our core features with varying limits and capabilities
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Core Features (All Plans)</h3>
                <ul className="space-y-3">
                  {[
                    'URL shortening and customization',
                    'QR code generation',
                    'Basic click analytics',
                    'Mobile-optimized dashboard',
                    'SSL security for all links',
                    'Global CDN for fast redirects'
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Advanced Features (Pro & Business)</h3>
                <ul className="space-y-3">
                  {[
                    'Custom domains and branding',
                    'Advanced analytics and reporting',
                    'UTM parameter automation',
                    'Team collaboration tools',
                    'API access and integrations',
                    'Priority customer support'
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Can't find the answer you're looking for? Contact our support team.
            </p>
          </div>

          <div className="mt-16 space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-lg border bg-card p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
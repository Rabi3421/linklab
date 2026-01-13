'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  name: string
  price: {
    monthly: number
    yearly: number
  }
  description: string
  features: string[]
  isPopular?: boolean
  isYearly: boolean
  className?: string
}

export function PricingCard({ 
  name, 
  price, 
  description, 
  features, 
  isPopular = false, 
  isYearly,
  className 
}: PricingCardProps) {
  const currentPrice = isYearly ? price.yearly : price.monthly
  const savings = isYearly && price.monthly > 0 ? Math.round(((price.monthly * 12 - price.yearly) / (price.monthly * 12)) * 100) : 0

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative rounded-xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg",
        isPopular && "border-primary shadow-lg ring-2 ring-primary/20",
        className
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 text-xs font-medium text-white">
            <Star className="h-3 w-3" />
            Most Popular
          </div>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
        
        <div className="mt-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold">${currentPrice}</span>
            <span className="text-muted-foreground">/{isYearly ? 'year' : 'month'}</span>
          </div>
          {isYearly && savings > 0 && (
            <p className="mt-1 text-sm text-green-600 font-medium">
              Save {savings}% annually
            </p>
          )}
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={cn(
          "mt-8 w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isPopular
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            : "border bg-background hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {currentPrice === 0 ? 'Get Started' : 'Start Free Trial'}
      </button>
    </motion.div>
  )
}
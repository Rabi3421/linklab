'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideIcon, ArrowRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  status: 'available' | 'coming-soon'
  className?: string
}

export function ToolCard({ icon: Icon, title, description, href, status, className }: ToolCardProps) {
  const isAvailable = status === 'available'
  
  return (
    <motion.div
      whileHover={isAvailable ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative rounded-lg border bg-card p-6 shadow-sm transition-all",
        isAvailable ? "hover:shadow-md cursor-pointer" : "opacity-75",
        className
      )}
    >
      {!isAvailable && (
        <div className="absolute inset-0 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm font-medium">
            <Clock className="h-3 w-3" />
            Coming Soon
          </div>
        </div>
      )}
      
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
        <Icon className="h-6 w-6 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{description}</p>
      
      {isAvailable && (
        <Link 
          href={href}
          className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Try it now
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </motion.div>
  )
}
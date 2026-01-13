import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // For development, we'll use the anon client
    // In production, you'd use service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Try to add RLS policies for demo URLs
    const policies = [
      {
        name: 'Allow demo URL creation',
        sql: `CREATE POLICY "Allow demo URL creation" ON urls FOR INSERT WITH CHECK (user_id IS NULL);`
      },
      {
        name: 'Allow demo URL access',
        sql: `CREATE POLICY "Allow demo URL access" ON urls FOR SELECT USING (user_id IS NULL);`
      }
    ]

    const results = []
    
    for (const policy of policies) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: policy.sql })
        results.push({
          policy: policy.name,
          success: !error,
          error: error?.message || null
        })
      } catch (err) {
        results.push({
          policy: policy.name,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      message: 'RLS policy setup attempted',
      results
    })

  } catch (error) {
    console.error('Policy setup error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to setup policies',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/setup-database - Create database tables
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if we can execute raw SQL
    const createUrlsTable = `
      CREATE TABLE IF NOT EXISTS urls (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        original_url TEXT NOT NULL,
        short_code VARCHAR(20) NOT NULL UNIQUE,
        title VARCHAR(255),
        description TEXT,
        qr_code_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    // Try to create a minimal urls table first
    const { data, error } = await supabase.rpc('exec_sql', { sql: createUrlsTable })
    
    if (error) {
      console.error('Error creating table:', error)
      return NextResponse.json({ 
        error: 'Failed to create table',
        details: error.message,
        suggestion: 'Please create the urls table manually in Supabase dashboard'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database table created successfully'
    })
    
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Please create the tables manually in your Supabase dashboard'
    }, { status: 500 })
  }
}
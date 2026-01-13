import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/debug-schema - Debug database schema
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Try to get the schema information
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (error) {
      console.error('Error fetching tables:', error)
    }
    
    // Try to get urls table specifically
    const { data: urls, error: urlsError } = await supabase
      .from('urls')
      .select('*')
      .limit(0)
    
    // Try a simple insert to see what columns are expected
    const { data: testInsert, error: insertError } = await supabase
      .from('urls')
      .insert({})
      .select()
    
    return NextResponse.json({
      tables: tables || null,
      tablesError: error,
      urlsError: urlsError,
      insertError: insertError,
      message: 'Schema debug info'
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
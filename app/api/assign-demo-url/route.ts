import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// export async function POST(request: NextRequest) {
//   try {
//     const supabase = await createClient()
    
//     const { data: { user }, error: authError } = await supabase.auth.getUser()
    
//     if (authError || !user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = await request.json()
//     const { shortCode, originalUrl } = body

//     if (!shortCode || !originalUrl) {
//       return NextResponse.json({ error: 'Missing shortCode or originalUrl' }, { status: 400 })
//     }

//     // Check if demo URL exists in urls table
//     const { data: existingUrl, error: fetchError } = await supabase
//       .from('urls')
//       .select('*')
//       .eq('short_code', shortCode)
//       .eq('original_url', originalUrl)
//       .single()

//     if (fetchError && fetchError.code !== 'PGRST116') {
//       console.error('Error fetching demo URL:', fetchError)
//       return NextResponse.json({ error: 'Database error' }, { status: 500 })
//     }

//     if (existingUrl) {
//       // Update existing demo URL to assign it to the user
//       const { error: updateError } = await supabase
//         .from('urls')
//         .update({ 
//           user_id: user.id,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', existingUrl.id)

//       if (updateError) {
//         console.error('Error assigning URL to user:', updateError)
//         return NextResponse.json({ error: 'Failed to assign URL' }, { status: 500 })
//       }

//       return NextResponse.json({ 
//         success: true, 
//         message: 'Demo URL assigned to user',
//         url: existingUrl
//       })
//     } else {
//       // Create new URL entry for the user (in case demo URL was not stored)
//       const { data: newUrl, error: createError } = await supabase
//         .from('urls')
//         .insert({
//           user_id: user.id,
//           original_url: originalUrl,
//           short_code: shortCode,
//           title: `Demo URL - ${new URL(originalUrl).hostname}`,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         })
//         .select()
//         .single()

//       if (createError) {
//         console.error('Error creating URL for user:', createError)
//         return NextResponse.json({ error: 'Failed to create URL' }, { status: 500 })
//       }

//       return NextResponse.json({ 
//         success: true, 
//         message: 'Demo URL created for user',
//         url: newUrl
//       })
//     }

//   } catch (error) {
//     console.error('Error in assign-demo-url:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const { shortCode } = await request.json()
    if (!shortCode) {
      return NextResponse.json({ error: 'shortCode required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Only update if the url is currently unassigned (user_id IS NULL)
    const { error } = await supabase
      .from('urls')
      .update({ user_id: user.id })
      .eq('short_code', shortCode)
      .is('user_id', null)

    if (error) {
      return NextResponse.json({ error: 'Failed to assign URL' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
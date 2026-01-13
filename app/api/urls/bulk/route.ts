import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/urls/bulk - Bulk operations on URLs
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, urlIds, data } = await request.json()

    if (!action || !Array.isArray(urlIds) || urlIds.length === 0) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 })
    }

    let result

    switch (action) {
      case 'delete':
        result = await supabase
          .from('urls')
          .update({ is_active: false })
          .in('id', urlIds)
          .eq('user_id', session.user.id)
        break

      case 'activate':
        result = await supabase
          .from('urls')
          .update({ is_active: true })
          .in('id', urlIds)
          .eq('user_id', session.user.id)
        break

      case 'deactivate':
        result = await supabase
          .from('urls')
          .update({ is_active: false })
          .in('id', urlIds)
          .eq('user_id', session.user.id)
        break

      case 'add_tags':
        if (!data?.tags || !Array.isArray(data.tags)) {
          return NextResponse.json({ error: 'Tags array required' }, { status: 400 })
        }
        
        // Create tags and link them to URLs
        for (const tagName of data.tags) {
          const { data: tag, error: tagError } = await supabase
            .from('tags')
            .upsert(
              { user_id: session.user.id, name: tagName },
              { onConflict: 'user_id,name' }
            )
            .select()
            .single()

          if (!tagError && tag) {
            // Link each URL to this tag
            const tagLinks = urlIds.map(urlId => ({ url_id: urlId, tag_id: tag.id }))
            await supabase
              .from('url_tags')
              .upsert(tagLinks, { onConflict: 'url_id,tag_id' })
          }
        }
        result = { error: null }
        break

      case 'remove_tags':
        if (!data?.tags || !Array.isArray(data.tags)) {
          return NextResponse.json({ error: 'Tags array required' }, { status: 400 })
        }

        // Get tag IDs
        const { data: tags } = await supabase
          .from('tags')
          .select('id, name')
          .eq('user_id', session.user.id)
          .in('name', data.tags)

        if (tags && tags.length > 0) {
          const tagIds = tags.map(tag => tag.id)
          result = await supabase
            .from('url_tags')
            .delete()
            .in('url_id', urlIds)
            .in('tag_id', tagIds)
        } else {
          result = { error: null }
        }
        break

      case 'set_campaign':
        result = await supabase
          .from('urls')
          .update({ campaign_id: data?.campaignId || null })
          .in('id', urlIds)
          .eq('user_id', session.user.id)
        break

      case 'set_expiry':
        result = await supabase
          .from('urls')
          .update({ expiry_date: data?.expiryDate || null })
          .in('id', urlIds)
          .eq('user_id', session.user.id)
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (result.error) {
      console.error('Bulk operation error:', result.error)
      return NextResponse.json({ error: 'Bulk operation failed' }, { status: 500 })
    }

    return NextResponse.json({
      message: `Bulk ${action} completed successfully`,
      affected: urlIds.length
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
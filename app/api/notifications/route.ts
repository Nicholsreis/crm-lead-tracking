import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NotificationService } from '@/lib/services/notificationService'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const unreadOnly = searchParams.get('unread_only') === 'true'

    const notificationService = new NotificationService(supabase)
    const notifications = await notificationService.getNotifications(user.id, unreadOnly)
    const unreadCount = await notificationService.getUnreadCount(user.id)

    return NextResponse.json({
      success: true,
      data: notifications,
      unread_count: unreadCount,
    })
  } catch (error) {
    console.error('GET /api/notifications error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

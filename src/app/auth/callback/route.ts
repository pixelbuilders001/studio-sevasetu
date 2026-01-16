import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // This can be ignored if it's called from a RSC that doesn't allow setting cookies
          }
        },
      },
    }
  )

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Auth callback exchange error:', error.message)
    } else {
      console.log('Auth callback exchange success for user:', data.user?.email)
    }
  }

  // After exchange, verify if we have a user
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    console.log('Final auth callback user check:', user.email)
  } else {
    console.warn('Final auth callback user check: No user found after exchange')
  }

  return NextResponse.redirect(new URL(next, req.url))
}

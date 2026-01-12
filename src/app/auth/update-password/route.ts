import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (token) {
    const { error } = await supabase.auth.verifyOtp({ token, type: 'recovery' })
    if (!error) {
      return NextResponse.redirect(new URL('/update-password', req.url))
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', req.url))
}

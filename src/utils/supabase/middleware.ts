import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
            cookieOptions: {
                name: 'sb-session-auth',
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes logic
    const path = request.nextUrl.pathname
    const isConfirmationPath = path.startsWith('/confirmation')
    const isBookingDetailsPath = /^\/book\/[^/]+\/details$/.test(path)

    // Detect if this is likely a PWA/Standalone app request
    const isStandalone = request.headers.get('sec-ch-ua-mobile') === '?1' ||
        request.headers.get('user-agent')?.includes('Standalone') ||
        request.nextUrl.searchParams.get('utm_source') === 'pwa';

    if (!user && (isConfirmationPath || isBookingDetailsPath)) {
        // For PWA users, we skip the hard redirection in middleware
        // This allows AuthContext.tsx to manually re-hydrate from localStorage
        // if the session cookie is missing on the first load of a refresh.
        if (isStandalone) {
            return response;
        }

        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return response
}

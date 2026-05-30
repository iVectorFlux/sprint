import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the auth token safely
  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (err) {
    console.warn('Middleware Supabase auth getUser failed (offline/unseeded fallback):', err);
  }

  const pathname = request.nextUrl.pathname

  // Define route types
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')
  const isPublicPage = pathname === '/'
  const isOnboardingPage = pathname.startsWith('/onboarding')

  // Unauthenticated users → redirect to login (except public + auth pages)
  if (!user && !isAuthPage && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Authenticated users → redirect away from auth pages
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Authenticated users on dashboard → check onboarding status safely
  if (user && !isAuthPage && !isPublicPage && !isOnboardingPage) {
    try {
      // Check if user has completed onboarding
      const { data: userData } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (userData && !userData.onboarding_completed) {
        const url = request.nextUrl.clone()
        url.pathname = '/onboarding'
        return NextResponse.redirect(url)
      }
    } catch (err) {
      console.warn('Middleware onboarding check failed (offline/unseeded fallback):', err);
    }
  }

  // Users who completed onboarding shouldn't see onboarding again safely
  if (user && isOnboardingPage) {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

      if (userData && userData.onboarding_completed) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (err) {
      console.warn('Middleware onboarding verify check failed (offline/unseeded fallback):', err);
    }
  }

  return supabaseResponse
}

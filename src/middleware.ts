// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { token }   = req.nextauth
    const { pathname } = req.nextUrl

    // Role enforcement: wrong role gets redirected to their own portal
    if (pathname.startsWith('/dashboard') && token?.role !== 'TEACHER') {
      return NextResponse.redirect(new URL('/portal', req.url))
    }
    if (pathname.startsWith('/portal') && token?.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      // Return true = user is authenticated; withAuth handles unauthenticated → /login
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/portal/:path*'],
}

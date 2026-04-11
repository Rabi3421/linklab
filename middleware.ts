import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const encoder = new TextEncoder();

const getJwtSecret = () => {
  const value =
    process.env.JWT_ACCESS_SECRET ??
    (process.env.NODE_ENV !== 'production' ? 'linklab-dev-jwt_access_secret' : undefined);

  if (!value) {
    throw new Error('JWT_ACCESS_SECRET is not configured.');
  }

  return encoder.encode(value);
};

const ACCESS_COOKIE_NAME = 'linklab_access_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (payload.role !== 'superadmin') {
      // Authenticated but not a superadmin — show 403
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>403 – Forbidden | LinkLab</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f1117; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { text-align: center; padding: 3rem 2rem; max-width: 400px; background: #1a1d27; border: 1px solid #2a2d3a; border-radius: 12px; }
    h1 { font-size: 4rem; margin: 0 0 0.5rem; background: linear-gradient(135deg,#fbbf24,#fb7185); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { color: #94a3b8; margin-bottom: 1.5rem; }
    a { display: inline-block; padding: 0.6rem 1.4rem; background: linear-gradient(135deg,#fbbf24,#f97316); color: #000; border-radius: 8px; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>403</h1>
    <p>You don't have permission to access this page. Super Admin access only.</p>
    <a href="/dashboard">Go to Dashboard</a>
  </div>
</body>
</html>`,
        { status: 403, headers: { 'Content-Type': 'text/html' } },
      );
    }

    return NextResponse.next();
  } catch {
    // Invalid / expired token — redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};

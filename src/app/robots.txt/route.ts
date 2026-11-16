import { NextResponse } from 'next/server';

export async function GET() {
  // Canonical domain, hardcoded: the Vercel NEXT_PUBLIC_SITE_URL variable
  // still points at the old vercel.app host, so robots.txt must not trust it.
  const baseUrl = 'https://www.globalbizzhub.com';

  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /auth/

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

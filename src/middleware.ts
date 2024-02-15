import type { NextRequest } from 'next/server'

// Add correlation id to request headers
export function middleware(request: NextRequest) {
  request.headers.set('x-correlation-id', Math.random().toString(36).slice(2, 12))
}
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // MiniKit webhook endpoint
  const body = await req.json().catch(() => ({}))
  console.log('Webhook received:', body)
  return NextResponse.json({ success: true })
}

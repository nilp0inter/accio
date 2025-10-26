import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { type } = await request.json()
  const supabase = createClient()

  const { data, error } = await supabase.functions.invoke('ai-mock', {
    body: { type },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
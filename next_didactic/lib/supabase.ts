import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

export const getAuthenticatedClient = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return supabase.auth.setSession(session)
}
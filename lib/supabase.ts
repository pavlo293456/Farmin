import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)

export type Vendor = {
  id:            string
  user_id:       string
  created_at:    string
  updated_at:    string
  business_name: string
  bio:           string | null
  photo_url:     string | null
  products:      string[]
  this_week:     string | null
  markets:       { market_id: string; market_name: string; dates: string }[]
  instagram:     string | null
  website:       string | null
  gallery:       string[]
  is_published:  boolean
}

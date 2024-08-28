import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ckmqczvzhwwwjgggrpas.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbXFjenZ6aHd3d2pnZ2dycGFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1NzY0NDUsImV4cCI6MjAzODE1MjQ0NX0.geUDGM6e37ZtVH1s_pmpXr28-fLIuSThkuO5Q4xuHWI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
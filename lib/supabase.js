import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbwmwggmevbhecvhsxhg.supabase.co';

// ⚠️ KEEP THE SINGLE QUOTES AROUND YOUR KEY
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid213Z2dtZXZiaGVjdmhzeGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNjk3ODMsImV4cCI6MjA5MTg0NTc4M30.gvqK0Wv0aaK1RYkThFy2QKxt3ukw5VRjR5KBC8emGag'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // 🛡️ This explicitly forces the browser to send the API keys
  global: {
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
  },
});
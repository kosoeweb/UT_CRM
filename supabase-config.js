// သင့်ရဲ့ Supabase Project ထဲက တကယ့် URL နဲ့ Key ကို အစားထိုးထည့်ပါ
const SUPABASE_URL = 'https://zdifzvpjmmmsfitjsraw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Eghy_AeArZhWU86ETOoWqg_FI8xXh9P';

// ⬇️ ဒီစာကြောင်းက အရေးကြီးဆုံးပါ (Client ဖန်တီးတဲ့ အဆင့်) ⬇️
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: window.sessionStorage, // 👈 ဒီနေရာက အဓိကပါ (Tab ပိတ်ရင် Session ဖျက်ပစ်ပါမည်)
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
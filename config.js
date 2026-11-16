// Salin file ini ke tiga folder situs setelah mengisi proyek Supabase.
// Publishable / anon key BOLEH terlihat di frontend; RLS wajib aktif.
// JANGAN memasukkan service_role key, secret key, atau CRON_SECRET ke sini.
window.SMART_AC_CONFIG = {
  supabaseUrl: 'https://dexpycjeftqrqyujlyjn.supabase.co', // contoh: https://abcdef.supabase.co
  supabaseAnonKey: 'sb_publishable_UOvK5mi5eSme3o31hci5ow_izyNoqIp', // publishable key / legacy anon key, BUKAN secret key
  timezone: 'Asia/Jakarta',
  city: 'Kota Serang, Banten',
  latitude: -6.1177,
  longitude: 106.1539,
  domains: {
    dashboard: 'https://dashboard.penyelamatharimu.my.id',
    ac: 'https://ac.penyelamatharimu.my.id',
    remote: 'https://remote.penyelamatharimu.my.id'
  }
};

// Smart AC by RZKY Studio — satu sesi login untuk tiga subdomain GitHub Pages.
// Penyimpanan cookie JavaScript dipakai untuk proyek kuliah (bukan cookie HttpOnly).
// Tetap wajib pakai Supabase RLS, RPC yang memvalidasi hak akses, dan HTTPS.
export const PARENT_DOMAIN = 'penyelamatharimu.my.id';
export const STORAGE_KEY = 'smart-ac-rzky-shared-auth-v1';
const COOKIE_TTL = 7 * 24 * 60 * 60;
const COOKIE_PART = 2400;

function cookieName(key) {
  return 'rzky_sso_' + String(key).replace(/[^a-zA-Z0-9_-]/g, '_');
}
function cookieAttributes(maxAge = COOKIE_TTL) {
  return `; Path=/; Domain=${PARENT_DOMAIN}; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
function readCookie(name) {
  const prefix = name + '=';
  const found = document.cookie.split('; ').find(part => part.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}
function deleteCookie(name) {
  document.cookie = `${name}=${cookieAttributes(0)}`;
}
export function supportedHost() {
  return location.protocol === 'https:' &&
    (location.hostname === PARENT_DOMAIN || location.hostname.endsWith('.' + PARENT_DOMAIN));
}

// Supabase-js menyediakan antarmuka storage resmi: getItem/setItem/removeItem.
// Nilai session dipecah agar tidak melewati batas ukuran satu cookie.
export const sharedSessionStorage = {
  getItem(key) {
    const base = cookieName(key);
    const count = Number(readCookie(base + '_count'));
    if (!Number.isInteger(count) || count < 1 || count > 20) return null;
    let encoded = '';
    for (let i = 0; i < count; i++) {
      const part = readCookie(base + '_' + i);
      if (part === null) return null;
      encoded += part;
    }
    try { return decodeURIComponent(encoded); } catch { return null; }
  },
  setItem(key, value) {
    const base = cookieName(key);
    const payload = encodeURIComponent(value);
    const count = Math.ceil(payload.length / COOKIE_PART);
    if (count < 1 || count > 20) throw new Error('Sesi terlalu panjang untuk cookie.');
    const previous = Number(readCookie(base + '_count')) || 0;
    for (let i = 0; i < count; i++) {
      document.cookie = `${base}_${i}=${payload.slice(i * COOKIE_PART, (i + 1) * COOKIE_PART)}${cookieAttributes()}`;
    }
    document.cookie = `${base}_count=${count}${cookieAttributes()}`;
    for (let i = count; i < Math.min(previous, 21); i++) deleteCookie(base + '_' + i);
  },
  removeItem(key) {
    const base = cookieName(key);
    const count = Number(readCookie(base + '_count')) || 0;
    for (let i = 0; i < Math.min(count, 21); i++) deleteCookie(base + '_' + i);
    deleteCookie(base + '_count');
  }
};

export function hasSharedSession() {
  return sharedSessionStorage.getItem(STORAGE_KEY) !== null;
}
export function makeSharedSupabaseClient(createClient, cfg) {
  return createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: {
      storage: sharedSessionStorage,
      storageKey: STORAGE_KEY,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });
}
export function dashboardUrl(cfg = window.SMART_AC_CONFIG || {}) {
  return cfg.domains?.dashboard || 'https://dashboard.penyelamatharimu.my.id';
}
export function loginUrl(next, cfg = window.SMART_AC_CONFIG || {}) {
  const url = new URL('/login.html', dashboardUrl(cfg));
  const dest = safeDestination(next, cfg);
  if (dest) url.searchParams.set('next', dest);
  return url.href;
}
export function safeDestination(input, cfg = window.SMART_AC_CONFIG || {}) {
  try {
    if (!input) return dashboardUrl(cfg);
    const url = new URL(input);
    const allowed = Object.values(cfg.domains || {
      dashboard: 'https://dashboard.penyelamatharimu.my.id',
      ac: 'https://ac.penyelamatharimu.my.id',
      remote: 'https://remote.penyelamatharimu.my.id'
    }).map(x => new URL(x).origin);
    if (url.protocol !== 'https:' || !allowed.includes(url.origin)) return dashboardUrl(cfg);
    if (url.pathname === '/login.html') return dashboardUrl(cfg);
    return url.href;
  } catch { return dashboardUrl(cfg); }
}

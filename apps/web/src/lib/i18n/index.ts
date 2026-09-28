import { browser } from '$app/environment'
import { init, register } from 'svelte-i18n'

const defaultLocale = 'en'
const supportedLocales = ['en', 'id'] // Daftar bahasa yang Anda dukung

register('en', () => import('../../locales/en.json'))
register('id', () => import('../../locales/id.json'))

function getDefaultLanguage() {
  // Cegah error jika dijalankan di server (SSR)
  if (!browser) return defaultLocale;

  // Ambil bahasa dari browser (contoh: 'en-US' atau 'id-ID')
  const lang = window.navigator.language;
  
  // Ambil kode bahasanya saja (contoh: 'en' atau 'id')
  const shortLang = lang.split('-')[0];

  // Pastikan bahasa yang terdeteksi ada di daftar bahasa yang didukung
  if (supportedLocales.includes(shortLang)) {
    return shortLang;
  }

  // Jika bahasa tidak didukung (misal 'fr' atau 'ja'), kembalikan ke default
  return defaultLocale;
}

init({
  fallbackLocale: defaultLocale,
  // Gunakan fungsi yang sudah dibuat
  initialLocale: getDefaultLanguage(), 
})
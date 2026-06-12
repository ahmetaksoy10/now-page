import { useCallback, useEffect, useState } from 'react'

// localStorage anahtarı — index.html'deki önyükleme script'i ile aynı olmalı.
const STORAGE_KEY = 'now-page-theme'

/**
 * useTheme — Dark/Light tema yönetimi için custom hook.
 *
 * Tasarım kararı: Tema bilgisini React state'i yerine <html data-theme="...">
 * attribute'üne yazıyoruz. Böylece TÜM renk değişimi CSS değişkenleri üzerinden
 * (tek bir attribute selector ile) gerçekleşir ve React tarafında hiçbir
 * component'in yeniden render edilmesi gerekmez — performansın sırrı budur.
 */
export function useTheme() {
  // İlk değer, index.html'deki FOUC-önleyici script'in yazdığı attribute'ten okunur.
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark',
  )

  // Tema her değiştiğinde hem DOM'a hem kalıcı depolamaya yansıt.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // localStorage kapalıysa (gizli sekme vb.) sessizce devam et — kritik değil.
    }
  }, [theme])

  // useCallback: Toggle fonksiyonunun referansı sabit kalır,
  // bu fonksiyonu prop alan component'ler gereksiz yere yeniden çizilmez.
  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}

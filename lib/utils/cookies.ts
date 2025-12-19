const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
}

export const cookies = {
  set(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') return
    
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    
    let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${COOKIE_OPTIONS.path}; SameSite=${COOKIE_OPTIONS.sameSite}`
    
    if (COOKIE_OPTIONS.secure) {
      cookieString += '; Secure'
    }
    
    document.cookie = cookieString
  },

  get(name: string): string | null {
    if (typeof document === 'undefined') return null
    
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
      }
    }
    
    return null
  },

  remove(name: string): void {
    if (typeof document === 'undefined') return
    
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${COOKIE_OPTIONS.path}; SameSite=${COOKIE_OPTIONS.sameSite}`
  },
}


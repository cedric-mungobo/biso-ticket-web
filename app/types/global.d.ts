declare global {
  interface Window {
    gsap: typeof import('gsap')
    grecaptcha: {
      render: (container: HTMLElement, options: {
        sitekey: string
        theme?: 'light' | 'dark'
        size?: 'normal' | 'compact'
        tabindex?: number
        callback?: (token: string) => void
        'expired-callback'?: () => void
        'error-callback'?: () => void
      }) => number
      reset: (widgetId: number) => void
      getResponse: (widgetId: number) => string
    }
  }
}

export {}

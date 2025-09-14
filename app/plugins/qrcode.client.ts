import QRCodeStyling, { Options } from 'qr-code-styling'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      qrCodeStyling: (options: Partial<Options>): QRCodeStyling => {
        return new QRCodeStyling(options)
      },
    },
  }
})

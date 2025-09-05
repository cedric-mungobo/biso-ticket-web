declare module '#app' {
  interface NuxtApp {
    $customFetch: typeof $fetch
    $myFetch: typeof $fetch
    $pdfMake?: any
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $customFetch: typeof $fetch
    $myFetch: typeof $fetch
    $pdfMake?: any
  }
}

export {}

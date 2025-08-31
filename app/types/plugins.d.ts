declare module '#app' {
  interface NuxtApp {
    $customFetch: typeof $fetch
    $myFetch: typeof $fetch
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $customFetch: typeof $fetch
    $myFetch: typeof $fetch
  }
}

export {}

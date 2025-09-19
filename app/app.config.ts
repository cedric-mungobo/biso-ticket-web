export default defineAppConfig({
  ui: {
    colors: {
      // map aliases to Tailwind color families defined in app/assets/index.css
      primary: 'primary',
      secondary: 'secondary',
      neutral: 'slate',
      info: 'sky',
      success: 'green',
      warning: 'amber',
      error: 'red'
    },
    button: {
      slots: {
        base: 'font-semibold'
      }
    },
    // Configuration toaster déplacée dans app.vue pour plus de flexibilité
  }
})



// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: [
        "rxjs"
    ]
  },
  compatibilityDate: "2024-10-22",
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue',
    '@nuxt/eslint'
  ],
  primevue: {
    /* Options */
  },
  srcDir: 'src/',
  typescript: {
    typeCheck: true
  }
})

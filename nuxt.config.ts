// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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

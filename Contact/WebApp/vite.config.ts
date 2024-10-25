import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            // src/index.ts is where we have exported the component(s)
            entry: resolve(__dirname, "src/index.ts"),
            name: "Contact",
            // the name of the output files when the build is run
            fileName: "contact",
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [
                "vue",
                "primevue",
            ],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: "Vue",
                    primevue: "primevue",
                },
            },
        },
    },
})
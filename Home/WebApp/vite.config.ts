import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "url";
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [
            {find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url))},
        ],
    },
    build: {
        lib: {
            // src/index.ts is where we have exported the component(s)
            entry: resolve(__dirname, "src/index.ts"),
            name: "Home",
            // the name of the output files when the build is run
            fileName: "home",
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

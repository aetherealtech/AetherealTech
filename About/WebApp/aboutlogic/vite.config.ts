import { defineConfig } from 'vite'
import {resolve} from "path";

// https://vite.dev/config/
export default defineConfig({
    build: {
        lib: {
            // src/index.ts is where we have exported the component(s)
            entry: resolve(__dirname, "src/index.ts"),
            name: "AboutLogic",
            // the name of the output files when the build is run
            fileName: "aboutlogic",
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {},
            },
        },
    },
})

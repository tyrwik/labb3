import { defineConfig } from "vite";
import { resolve } from "path"

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                sass: resolve(__dirname, "sass.html"),
                animation: resolve(__dirname, "animation.html"),
                diagram: resolve(__dirname, "diagram.html"),
                map: resolve(__dirname, "map.html")
            }
        }
    }
});
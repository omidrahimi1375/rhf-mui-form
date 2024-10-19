import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: "./tsconfig.app.json"
    }),
    react()
  ],
  build: {
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "muiForm",
      formats: ["es", "cjs", "umd", "iife"],
      // the proper extensions will be added
      // fileName: "index",
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        /node_modules/,
        "@emotion/react",
        "@emotion/styled",
        "@hookform/resolvers",
        "@mui/material",
        "@mui/x-date-pickers",
        "date-fns-jalali",
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-hook-form",
        "react-imask",
        "stylis",
        "stylis-plugin-rtl",
        "zod"
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          "@emotion/react": "EmotionReact",
          "@emotion/styled": "EmotionStyled",
          "@hookform/resolvers": "HookFormResolvers",
          "@mui/material": "MuiMaterial",
          "@mui/x-date-pickers": "MuiXDatePickers",
          "date-fns-jalali": "DateFnsJalali",
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJSXRuntime",
          "react-hook-form": "ReactHookForm",
          "react-imask": "ReactImask",
          stylis: "Stylis",
          "stylis-plugin-rtl": "StylisPluginRtl",
          zod: "Zod"
        }
      }
    }
  },
  publicDir: false
});

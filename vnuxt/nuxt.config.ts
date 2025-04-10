import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  devServer: {
    port: 8000,
  },
  spaLoadingTemplate: false,
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
  ],
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3000",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

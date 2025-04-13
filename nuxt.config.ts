// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  // typescript: {
  //   strict: true, // Включаем строгий режим TypeScript
  //   typeCheck: true, // Включаем проверку типов при сборке
  // },
});

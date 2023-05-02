export default defineI18nConfig(nuxt => ({
  fallbackLocale: "en-US",
  datetimeFormats: {
    "en-US": {
      text: {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    },
    "zh-CN": {
      text: {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    },
  },
}));

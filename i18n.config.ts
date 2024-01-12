export default defineI18nConfig(() => ({
  fallbackLocale: "en-US",
  datetimeFormats: {
    "en-US": {
      date: {
        dateStyle: "medium",
      },
      time: {
        dateStyle: "medium",
        timeStyle: "medium",
        hour12: false,
      },
    },
    "zh-CN": {
      date: {
        dateStyle: "medium",
      },
      time: {
        dateStyle: "medium",
        timeStyle: "medium",
        hour12: false,
      },
    },
  },
}));

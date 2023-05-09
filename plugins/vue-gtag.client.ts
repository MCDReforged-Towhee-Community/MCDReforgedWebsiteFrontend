import VueGtag, {trackRouter} from "vue-gtag-next";

export default defineNuxtPlugin((nuxtApp) => {
  if (window.origin === useRuntimeConfig().public.baseURL) {
    nuxtApp.vueApp.use(VueGtag, {
      property: {
        id: "G-F6SNQDQN12",
      },
    });
    trackRouter(useRouter());
  }
});

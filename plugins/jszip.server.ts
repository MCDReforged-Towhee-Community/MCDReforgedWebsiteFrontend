import JSZip from "jszip";

export default defineNuxtPlugin((nuxt) => {
    nuxt.vueApp.use(JSZip);
});

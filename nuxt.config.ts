// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: "MCDR Plugin Catalogue",
            meta: [
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1"
                },
                {charset: "utf-8"},
            ],
        },
    },

    nitro: {
        preset: "vercel-edge",
    },
});

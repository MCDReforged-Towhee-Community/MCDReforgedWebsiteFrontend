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
            link: [
                {
                    rel: "icon",
                    type: "image/x-icon",
                    href: "https://avatars.githubusercontent.com/u/63280128"
                },
            ],
        },
    },

    modules: [
        "@element-plus/nuxt",
    ],

    nitro: {
        preset: "vercel-edge",
    },

    runtimeConfig: {
        public: {
            baseURL: "https://mcdr.zhanganzhi.com",
        },
    },

    telemetry: false,
});

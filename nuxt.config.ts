import {nodeResolve} from "@rollup/plugin-node-resolve";

const baseURL = "https://mcdr.zhanganzhi.com";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            meta: [
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1"
                },
                {charset: "utf-8"},
                {name: "description", content: "MCDR Plugin Catalogue"},
                {
                    name: "keywords",
                    content: "MCDReforged, MCDR, Minecraft, Plugin Catalogue"
                },
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

    css: [
        // project css
        "@/assets/main.scss",

        // bytemd
        "bytemd/dist/index.css",
        "github-markdown-css/github-markdown-light.css",
        "highlight.js/styles/github.css",
        "katex/dist/katex.css",

        // element plus
        "element-plus/theme-chalk/display.css",

        // open-props
        "open-props/style",
    ],

    imports: {
        dirs: [
            "stores",
        ]
    },

    modules: [
        "@element-plus/nuxt",
        "@nuxtjs/google-fonts",
        "@nuxtjs/i18n",
        "@nuxtjs/robots",
        "@pinia/nuxt",
    ],

    nitro: {
        rollupConfig: {
            // @ts-ignore
            plugins: [
                // https://github.com/element-plus/element-plus/issues/10979#issuecomment-1473107778
                nodeResolve({exportConditions: ['node']}),
            ],
        },
    },

    runtimeConfig: {
        public: {
            baseURL: baseURL,
            leanCloud: {
                appId: "DFlxCu7mQRyfVOVeMnJsreh4-MdYXbMMI",
                appKey: "mxyNDiUvRTsN5UPyANTvTr5v",
                serverURL: "https://dflxcu7m.api.lncldglobal.com",
            },
        },
    },

    telemetry: false,

    // modules options
    googleFonts: {
        families: {
            "Noto+Sans+SC": true,
            Raleway: {
                wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
            },
        },
    },

    i18n: {
        baseUrl: baseURL,
        locales: [
            {
                code: "en-US",
                iso: "en-US",
                file: "en-US.js",
                name: "English",
            },
            {
                code: "zh-CN",
                iso: "zh-CN",
                file: "zh-CN.js",
                name: "简体中文",
            },
        ],
        defaultLocale: "en-US",
        strategy: "no_prefix",
        langDir: "locales",
        vueI18n: {
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
        },
    },

    pinia: {
        autoImports: [
            "defineStore",
            "storeToRefs",
        ],
    },
});

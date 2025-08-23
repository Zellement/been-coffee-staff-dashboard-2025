import { defineNuxtConfig } from 'nuxt/config'
import eslintVitePlugin from 'vite-plugin-eslint'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    devServerHandlers: [],

    ssr: false,

    nitro: {
        compressPublicAssets: true,
        minify: true,
        preset: 'netlify'
    },

    modules: [
        '@nuxt/image',
        '@pinia/nuxt',
        'nuxt-viewport',
        '@nuxt/icon',
        '@nuxt/ui',
        '@nuxtjs/supabase'
    ],

    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            exclude: [
                '/login',
                '/register',
                '/forgot-password',
                '/update-password',
                '/locations/**'
            ]
        }
    },

    ui: {
        colorMode: false
    },

    // Contentful image provider
    image: {
        provider: 'contentful',

        contentful: {
            domain: 'images.ctfassets.net'
        }
    },

    // Storyblok image provider
    // image: {
    //     domains: [
    //         'https://a.storyblok.com',
    //         'localhost',
    //     ],
    //     screens: {
    //         '3xs': 21 * 16,
    //         '2xs': 23 * 16,
    //         xs: 25.625 * 16,
    //         sm: 30 * 16,
    //         'sm-md': 35 * 16,
    //         md: 43.125 * 16,
    //         lg: 54.875 * 16,
    //         xl: 79.6875 * 16,
    //         '2xl': 90 * 16,
    //         '3xl': 100 * 16,
    //         max: 1920
    //     }
    // },

    css: ['@/assets/css/app.css'],

    components: [
        {
            path: '~/components',
            pathPrefix: false
        }
    ],

    viewport: {
        breakpoints: {
            initial: 0,
            '3xs': 21 * 16, // 336px
            '2xs': 23 * 16, // 368px
            xs: 25.625 * 16, // 410px
            sm: 30 * 16, // 480px
            'sm-md': 35 * 16, // 560px
            md: 43.125 * 16, // 690px
            lg: 54.875 * 16, // 878px
            xl: 79.6875 * 16, // 1275px
            '2xl': 90 * 16, // 1440px
            '3xl': 100 * 16, // 1600px
            max: 1848 // 1848px
        },
        fallbackBreakpoint: 'initial'
    },

    // Allows for local testing on devices
    devServer: {
        port: 3000, // default: 3000
        host: '0.0.0.0' // default: localhost
    },

    app: {
        head: {
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                },
                {
                    name: 'description',
                    content: 'Been Coffee Staff Dashboard'
                },
                { id: 'og-type', property: 'og:type', content: 'website' }
            ],
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon.png'
                }
            ]
        }
        // pageTransition: { name: 'page', mode: 'out-in' }
    },

    runtimeConfig: {
        public: {
            WEBSITE_URL: import.meta.env.WEBSITE_URL
        },
        CONTENTFUL_CDA_ACCESS_TOKEN: import.meta.env
            .CONTENTFUL_CDA_ACCESS_TOKEN,
        CONTENTFUL_SPACE_ID: import.meta.env.CONTENTFUL_SPACE_ID,
        CONTENTFUL_CMA_ACCESS_TOKEN: import.meta.env
            .CONTENTFUL_CMA_ACCESS_TOKEN,
        CONTENTFUL_ENVIRONMENT_ID: import.meta.env.CONTENTFUL_ENVIRONMENT_ID
    },

    vite: {
        plugins: [
            tailwindcss(),
            eslintVitePlugin({
                fix: true,
                include: ['./**/*.vue', './**/*.ts', './**/*.js']
            })
        ]
    },

    typescript: {
        typeCheck: true,
        strict: true,
        tsConfig: {
            compilerOptions: {
                strict: true
            },
            include: [
                '@pinia/nuxt',
                '@types/node',
                '@nuxt/image',
                '@nuxt/types',
                '**/*.d.ts'
            ],
            exclude: ['app/types/contentful/*']
        }
    },

    build: {
        transpile: ['@effect-digital/vue-utils']
    },

    devtools: { enabled: true },

    compatibilityDate: '2024-08-08'
})

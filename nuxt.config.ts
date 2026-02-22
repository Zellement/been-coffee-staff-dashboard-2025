import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    ssr: false,

    nitro: {
        compressPublicAssets: true,
        minify: true,
        preset: 'netlify'
    },

    modules: [
        '@nuxt/image',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        'nuxt-viewport',
        '@nuxt/icon',
        '@nuxt/ui',
        '@nuxtjs/supabase',
        '@vite-pwa/nuxt'
    ],

    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Been Coffee Dashboard',
            description: 'Staff dashboard for Been Coffee',
            short_name: 'Been Dash',
            theme_color: '#FAB944',
            background_color: '#1B1D3C',
            icons: [
                {
                    src: '/icons/android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/icons/android-chrome-192x192.png',
                    sizes: '180x180',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/icons/android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable'
                }
            ],
            display: 'standalone'
        }
    },

    ui: {
        theme: {
            colors: [
                'primary',
                'secondary',
                'tertiary',
                'success',
                'info',
                'warning',
                'error',
                'highlighted'
            ]
        }
    },

    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/confirm',
            exclude: [
                '/login',
                '/register',
                '/forgot-password',
                '/update-password'
            ]
        },
        cookieOptions: {
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        },
        useSsrCookies: true
    },

    // Contentful image provider
    image: {
        provider: 'contentful',
        contentful: {
            domain: 'images.ctfassets.net'
        }
    },

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
        // @ts-expect-error
        plugins: [tailwindcss()]
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

    devtools: { enabled: false },

    compatibilityDate: '2024-08-08'
})

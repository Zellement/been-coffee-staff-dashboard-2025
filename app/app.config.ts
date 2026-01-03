export default defineAppConfig({
    ui: {
        colors: {
            primary: 'navy',
            secondary: 'butterscotch',
            tertiary: 'tuscany',
            info: 'blue',
            error: 'red',
            success: 'green'
        },

        badge: {
            variants: {
                size: {
                    '3xs': 'text-2xs px-1 py-px h-4 min-w-4 rounded-full'
                },
                color: {
                    purple: ' text-purple-800 border-purple-800 dark:border-purple-300 dark:text-purple-300'
                }
            },
            compoundVariants: [
                {
                    variant: 'subtle',
                    color: 'purple',
                    class: ' text-purple-900 bg-purple-500/20 border border-purple-300 dark:border-purple-800 dark:text-purple-400'
                }
            ]
        },
        card: {
            slots: {
                root: '!ring-0 card-border',
                header: 'p-3 sm:p-3',
                body: 'p-3 sm:p-3',
                footer: 'p-3 sm:p-3'
            }
        },

        slideover: {
            slots: {
                title: 'uc-text'
            }
        },

        button: {
            variants: {
                size: {
                    '2xs': 'px-1 gap-1 py-px text-2xs'
                }
            }
        },
        stepper: {
            slots: {
                trigger: 'size-4.5 m-0',
                wrapper: 'm-0',
                title: 'leading-tight!'
            },
            variants: {
                size: {
                    xs: {
                        wrapper: '!m-0'
                    }
                }
            }
        }
    }
})

export default defineAppConfig({
    ui: {
        colors: {
            primary: 'butterscotch',
            neutral: 'navy'
        },

        badge: {
            compoundVariants: [
                {
                    color: 'error',
                    variant: 'solid',
                    class: 'bg-gradient-to-br from-red-500 to-red-700 text-white '
                },
                {
                    color: 'success',
                    variant: 'solid',
                    class: 'bg-gradient-to-br from-green-500 to-green-700 text-white '
                }
            ]
        },

        carousel: {
            slots: {
                root: 'relative focus:outline-none',
                viewport: 'overflow-hidden',
                container: 'flex items-stretch',
                item: 'min-w-0 shrink-0 basis-full',
                controls: '',
                arrows: '',
                prev: 'absolute rounded-full',
                next: 'absolute rounded-full',
                dots: 'absolute inset-x-0 -bottom-7 flex flex-wrap items-center justify-center gap-3',
                dot: [
                    'cursor-pointer size-3 bg-accented rounded-full',
                    'transition'
                ]
            },
            variants: {
                orientation: {
                    vertical: {
                        container: 'flex-col -mt-4',
                        item: 'pt-4',
                        prev: 'top-4 sm:-top-12 left-1/2 -translate-x-1/2 rotate-90 rtl:-rotate-90',
                        next: 'bottom-4 sm:-bottom-12 left-1/2 -translate-x-1/2 rotate-90 rtl:-rotate-90'
                    },
                    horizontal: {
                        container: 'flex-row -ms-4',
                        item: 'ps-4',
                        prev: 'start-4 sm:-start-12 top-1/2 -translate-y-1/2',
                        next: 'end-4 sm:-end-12 top-1/2 -translate-y-1/2'
                    }
                },
                active: {
                    true: {
                        dot: 'data-[state=active]:bg-inverted'
                    }
                }
            }
        },

        card: {
            slots: {
                root: 'overflow-hidden rounded-none rounded-tl-md rounded-br-md h-full border border-l-seashell-300 border-t-seashell-300 border-b-seashell-800 border-r-seashell-800',
                header: 'p-3 sm:p-3',
                body: 'p-3 sm:p-3 ',
                footer: 'p-3 sm:p-3'
            },
            variants: {
                variant: {
                    solid: {
                        root: 'bg-gradient-to-tl from-seashell-200 to-white text-navy'
                    },
                    outline: {
                        root: 'bg-default ring ring-default divide-y divide-default'
                    },
                    soft: {
                        root: 'bg-elevated/50 divide-y divide-default'
                    },
                    subtle: {
                        root: 'bg-elevated/50 ring ring-default divide-y divide-default'
                    }
                }
            },
            defaultVariants: {
                variant: 'outline'
            }
        }
    }
})

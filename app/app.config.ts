export default defineAppConfig({
    ui: {
        colors: {
            primary: 'navy',
            secondary: 'tuscany',
            tertiary: 'butterscotch',
            neutral: 'seashell',
            elevated: 'butterscotch',
            inverted: 'navy',
            success: 'green',
            highlighted: 'blue'
        },

        button: {
            compoundVariants: [
                {
                    color: 'tertiary',
                    variant: 'solid',
                    class: 'bg-navy-500 text-butterscotch-500 dark:bg-butterscotch-500 dark:text-navy-500 hover:bg-tuscany-800 hover:text-seashell-300'
                }
            ]
        },

        modal: {
            slots: {
                overlay: 'bg-seashell-500/75 dark:bg-navy-500/75'
            }
        },

        badge: {
            compoundVariants: [
                {
                    color: 'error',
                    variant: 'solid',
                    class: 'bg-gradient-to-br from-red-600 to-red-800 text-white '
                },
                {
                    color: 'neutral',
                    variant: 'outline',
                    class: 'dark:ring-navy-400 ring-navy-100 bg-transparent'
                },
                {
                    color: 'success',
                    variant: 'solid',
                    class: 'bg-gradient-to-br from-green-600 to-green-800 text-white '
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
                root: 'overflow-hidden rounded-none rounded-tl-md rounded-br-md h-full border card-border',
                header: 'p-3 sm:p-3',
                body: 'p-3 sm:p-3',
                footer: 'p-3 sm:p-3'
            },
            variants: {
                variant: {
                    solid: {
                        root: 'bg-gradient-to-tl from-seashell-500 card-border to-white  dark:from-navy-500 dark:to-navy-600 '
                    },
                    outline: {
                        root: 'card-border ring-0'
                    },
                    soft: {
                        root: ''
                    },
                    subtle: {
                        root: 'bg-red-300'
                    },
                    success: {
                        root: ' bg-gradient-to-r from-green-600 to-green-700 text-white'
                    },
                    task: {
                        root: 'bg-gradient-to-tl from-seashell-200 to-white flex flex-col gap-3 relative dark:from-navy-500 dark:to-navy-600 ',
                        body: 'flex flex-col gap-1 items-start'
                    }
                }
            },
            defaultVariants: {
                variant: 'outline'
            }
        },

        drawer: {
            slots: {
                overlay: 'bg-zinc-700/75'
            }
        },

        skeleton: {
            base: 'bg-butterscotch-500/50'
        },

        slideover: {
            slots: {
                overlay: 'bg-seashell-700/75 dark:bg-navy-700/75',
                title: 'uc-text text-secondary',
                description: 'font-bold text-primary',
                content: 'ring-navy-400 divide-navy-400'
            }
        },

        input: {
            variants: {
                variant: {
                    outline:
                        'text-navy-500 dark:text-seashell-500 ring-navy-500 dark:ring-seashell-500 placeholder:text-navy-300 dark:placeholder:text-navy-300'
                }
            }
        },

        textarea: {
            variants: {
                variant: {
                    outline:
                        'text-navy-500 dark:text-seashell-500 ring-navy-500 dark:ring-seashell-500 placeholder:text-navy-300 dark:placeholder:text-navy-300'
                }
            },

            compoundVariants: [
                {
                    color: 'neutral',
                    variant: 'outline',
                    class: 'bg-white text-primary ring-navy-300 dark:bg-navy-900 dark:text-navy-200 dark:ring-navy-400'
                }
            ]
        },

        select: {
            variants: {
                variant: {
                    outline:
                        'text-navy-500 dark:text-seashell-500 ring-navy-500 dark:ring-seashell-500 '
                }
            }
        }
    }
})

export default defineAppConfig({
    ui: {
        colors: {
            primary: 'butterscotch',
            neutral: 'zinc'
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

        card: {
            slots: {
                root: 'rounded-lg overflow-hidden',
                header: 'p-4 sm:px-6 pb-0',
                body: 'p-4 sm:p-6',
                footer: 'p-4 sm:px-6'
            },
            variants: {
                variant: {
                    solid: {
                        root: 'bg-gradient-to-br from-butterscotch-50 to-butterscotch-100 text-navy'
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

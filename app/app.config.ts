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
                wrapper: 'm-0'
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

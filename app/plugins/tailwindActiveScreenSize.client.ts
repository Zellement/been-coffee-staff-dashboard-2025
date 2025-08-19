type Screens = Record<string, string>

export default defineNuxtPlugin(() => {
    // Only run the script in a development environment and on client-side
    if (process.env.NODE_ENV !== 'development' || process.server) {
        return
    }

    const screenSizes: Screens = {
        xs: '25rem',
        sm: '40rem',
        md: '48rem',
        'md-lg': '56rem',
        lg: '64rem',
        xl: '72rem',
        '2xl': '80rem',
        '3xl': '90rem',
        '4xl': '96rem'
    }

    const updateScreenSize = (): void => {
        const screenSizeContainer: HTMLDivElement = document.getElementById(
            'tw-screen-size-container'
        ) as HTMLDivElement

        const width: number = window.innerWidth
        let screenSize: string = ''

        const entries = Object.entries(screenSizes)
        entries.forEach(([key, size], idx) => {
            const minWidth = parseFloat(size.replace('rem', '')) * 16
            const nextEntry = entries[idx + 1]
            const nextMinWidth = nextEntry
                ? parseFloat(nextEntry[1].replace('rem', '')) * 16
                : Infinity
            if (width >= minWidth && width < nextMinWidth) {
                screenSize = key
            }
        })

        screenSizeContainer.innerText = 'screen: ' + screenSize
    }

    const screenSizeContainer: HTMLDivElement = document.createElement('div')
    screenSizeContainer.className =
        'fixed bottom-0 left-0 bg-black text-white font-bold text-[12px] p-0.5 leading-none'
    screenSizeContainer.style.zIndex = '9999'
    screenSizeContainer.id = 'tw-screen-size-container'

    document.body.appendChild(screenSizeContainer)

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
})

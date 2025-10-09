declare global {
    type ImageTypes = {
        url?: string
        alt?: string
        caption?: string
        focus?: string
    }

    type NavItem = {
        key: string
        label: string
        url: string
        subItems?: NavItem[]
    }

    type PlusOrMinus = 'plus' | 'minus'
    interface RepeaterItem {
        id: string
        key: string
        value: string
    }

    interface TemperatureRepeaterItem extends RepeaterItem {
        value: PlusOrMinus
    }

    interface UtmParameters {
        [key: `utm_${string}`]: string
    }

    interface Revision {
        global: number
        buckets: {
            noticeBoard: number
            taskInstances: number
            beenAwesomeWinners: number
            tableBookings: number
            dailyTasks: number
            routineTasks: number
            orders: number
            assets: number
        }
    }
}

export {}

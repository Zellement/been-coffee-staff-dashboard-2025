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

    export interface RotareadyShift {
        id: number
        eventType: number
        start: string
        end: string
        typeId: number
        typeName: string
        originEntityId: string
        originEntityName: string
        workEntityId: string
        workEntityName: string
        isCover: boolean
        isPublished: boolean
        rotaId: number
        broadcasting: boolean
        broadcastState: string | null
        details: string
        paid: boolean
        breakType: number
        breakValue: string
        userId: number
        userName: string
        typeColourId: number

        user: {
            id: number
            firstName: string
            lastName: string
            picture: string | null
        }

        endRest: string
        rest: string
        accountingEntityId: string
        accountingEntityName: string
        windowId: number
        payRateType: number
        payRateValue: number | null
        tagsType: number
        tagsValue: unknown[] // adjust if you know what’s inside
        lastEdited: {
            userId: number
            userName: string
            date: string
        }

        payRuleId: number

        shiftType: {
            id: number
            entityId: string | null
            name: string
            colourId: number
            suffix: string | null
            concatenatedName: string
        }
    }

    export type RotareadyAttendance = {
        events: RotareadyEvent[]
    }

    export type RotareadyEvent = {
        id: number
        userId: number
        userEntity: any | null
        entityId: any | null
        entityName: string | null
        date: string // ISO date string
        dateUtc: string // ISO date string
        eventType: number
        deviceId: any | null
        deviceName: string | null
        photoType: number
        gpsLatitude: number
        gpsLongitude: number
        trustState: number
        overtimeApprovalState: number
        editCount: number
        notes: string | null
    }
}

export {}

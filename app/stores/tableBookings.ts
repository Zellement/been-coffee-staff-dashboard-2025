import { defineStore } from 'pinia'

export const useTableBookingsStore = defineStore('tableBookings', () => {
    /**
     * State
     **/

    const allTableBookings: Ref<TypeTaskInstance[] | null> = ref(null)

    /**
     * Getters
     **/

    const tableBookingsForToday = computed(() => {
        if (!allTableBookings) return []

        const today = new Date()

        return (
            allTableBookings.value?.filter((booking) => {
                const bookingDate = new Date(booking.fields.dateTime)
                return (
                    bookingDate.getDate() === today.getDate() &&
                    bookingDate.getMonth() === today.getMonth() &&
                    bookingDate.getFullYear() === today.getFullYear()
                )
            }) || []
        )
    })

    /**
     * Actions
     **/

    /**
     * Return
     **/
    return {
        allTableBookings,
        tableBookingsForToday
    }
})

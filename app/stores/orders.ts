import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', () => {
    /**
     * State
     **/

    const allOrders: Ref<TypeOrder[] | null> = ref(null)
    const totalOrders: Ref<number | null> = ref(null)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    /**
     * Getters
     **/

    const todaysOrders: ComputedRef<TypeOrder[]> = computed(() => {
        if (!allOrders.value) return []
        return allOrders.value
            .filter((task: TypeOrder) => {
                const dDate = new Date(task.fields.expectedDeliveryDate)
                dDate.setHours(0, 0, 0, 0)
                return (
                    !task.fields.deliveryCheckedBy &&
                    !task.fields.deliveryCheckedAt &&
                    dDate.getTime() === today.getTime()
                )
            })
            .map((task: TypeOrder) => ({
                ...task
            }))
    })

    const overdueOrders: ComputedRef<TypeOrder[]> = computed(() => {
        if (!allOrders.value) return []
        return allOrders.value
            .filter((task: TypeOrder) => {
                const dDate = new Date(task.fields.expectedDeliveryDate)
                dDate.setHours(0, 0, 0, 0)
                return (
                    !task.fields.deliveryCheckedBy &&
                    !task.fields.deliveryCheckedAt &&
                    dDate.getTime() < today.getTime()
                )
            })
            .map((task: TypeOrder) => ({
                ...task
            }))
    })

    const upcomingOrders: ComputedRef<TypeOrder[]> = computed(() => {
        if (!allOrders.value) return []
        return allOrders.value
            .filter((task: TypeOrder) => {
                const dDate = new Date(task.fields.expectedDeliveryDate)
                dDate.setHours(0, 0, 0, 0)
                return (
                    !task.fields.deliveryCheckedBy &&
                    !task.fields.deliveryCheckedAt &&
                    dDate.getTime() > today.getTime()
                )
            })
            .map((task: TypeOrder) => ({
                ...task
            }))
    })

    const completedOrders: ComputedRef<TypeOrder[]> = computed(() => {
        if (!allOrders.value) return []
        // All orders that are left that are not in todaysOrders nor overdueOrders
        return allOrders.value.filter((task: TypeOrder) => {
            return (
                task.fields.deliveryCheckedBy && task.fields.deliveryCheckedAt
            )
        })
    })

    /**
     * Actions
     **/

    /**
     * Return
     **/
    return {
        allOrders,
        totalOrders,
        todaysOrders,
        overdueOrders,
        upcomingOrders,
        completedOrders
    }
})

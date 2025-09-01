export const useContentfulUtils = () => {
    const timezoneOffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
    const localISOTime = new Date(Date.now() - timezoneOffset)
        .toISOString()
        .slice(0, -1)

    const completeTask = async (task: TypeTaskInstance, key: string) => {
        const userStore = useUserStore()
        const toast = useToast()
        const uiStore = useUiStore()

        try {
            uiStore.refreshing = true
            await $fetch(`/api/contentful/update-entry`, {
                method: 'POST',
                body: {
                    id: task.sys.id,
                    fields: {
                        lastCompleted: localISOTime,
                        completedBy: `${userStore.userContentfulData.fields.name} ${userStore.userContentfulData.fields.surname}`
                    }
                }
            })
            toast.add({
                title: 'Task completed',
                color: 'success',
                icon: 'i-bx-check'
            })
            // Wait before refetching to allow Contentful to update
            setTimeout(async () => {
                try {
                    await refreshNuxtData(key)
                } catch (error) {
                    console.error('Error refreshing data', error)
                } finally {
                    uiStore.refreshing = false
                }
            }, 750)
        } catch (error) {
            toast.add({
                title: 'Error completing task',
                description: `Task "${task.fields.task.fields.title}" could not be completed.`,
                color: 'error'
            })
            console.error('Error completing task', error)
        }
    }

    const checkedOrder = async (task: TypeOrder, feedback?: string) => {
        const userStore = useUserStore()
        const toast = useToast()
        const uiStore = useUiStore()

        try {
            uiStore.refreshing = true
            await $fetch(`/api/contentful/update-entry`, {
                method: 'POST',
                body: {
                    id: task.sys.id,
                    fields: {
                        deliveryCheckedAt: localISOTime,
                        deliveryCheckedBy: `${userStore.userContentfulData.fields.name} ${userStore.userContentfulData.fields.surname}`,
                        feedback: feedback || ''
                    }
                }
            })
            toast.add({
                title: 'Order marked as checked',
                color: 'success',
                icon: 'i-bx-check'
            })
            // Wait before refetching to allow Contentful to update
            setTimeout(async () => {
                try {
                    await refreshNuxtData(['orders'])
                } catch (error) {
                    console.error('Error refreshing data', error)
                } finally {
                    uiStore.refreshing = false
                }
            }, 2000)
        } catch (error) {
            toast.add({
                title: 'Error checking order',
                description: `Sorry, please contact a manager.`,
                color: 'error'
            })
            console.error('Error checking order', error)
        }
    }

    const uploadReviews = async (data: any, locationId: string) => {
        await $fetch(`/api/contentful/update-entry`, {
            method: 'POST',
            body: {
                id: locationId,
                fields: {
                    reviewDataLastFetched: localISOTime,
                    reviewData: data
                }
            }
        })
    }

    return {
        completeTask,
        checkedOrder,
        uploadReviews
    }
}

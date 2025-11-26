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
            // If we have minutes to log, log them against the user
            if (task.fields?.task?.fields?.minutesToComplete) {
                await $fetch(`/api/contentful/update-user-taskHistory`, {
                    method: 'POST',
                    body: {
                        id: userStore.userContentfulData.sys.id,
                        data: {
                            timeInMinutes:
                                task.fields.task.fields?.minutesToComplete || 0,
                            taskName: task.fields.task.fields?.title || '',
                            location:
                                task.fields.location?.fields?.postcode || ''
                        }
                    }
                })
            }
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
            }, 2500)
        } catch (error) {
            toast.add({
                title: 'Error completing task',
                description: `Task could not be completed.`,
                color: 'error'
            })
            console.error('Error completing task', error)
            uiStore.refreshing = false
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
            }, 2500)
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

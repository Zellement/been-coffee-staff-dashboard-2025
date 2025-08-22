import { defineStore } from 'pinia'

interface UserData {
    display_name?: string
    contentful_id?: string
}

export const useUserStore = defineStore('user', () => {
    const userData = ref<UserData | null>(null)
    const userContentfulData = ref<TypeEmployee | null>(null)
    const userMeta = ref<any>(null)

    async function setUserData() {
        const locationsStore = useLocationsStore()

        const client = useSupabaseClient()

        const { data, error } = await client
            .from('profiles')
            .select('display_name, contentful_id')

        if (error) {
            console.error('Error fetching user data:', error)
        }

        const user = useSupabaseUser()

        userMeta.value = user.value
        userData.value = data?.[0] || null

        if (
            userData.value &&
            typeof userData.value === 'object' &&
            'contentful_id' in userData.value
        ) {
            const contentfulData = await $fetch('/api/contentful/fetch-entry', {
                params: { id: (userData.value as UserData).contentful_id }
            })
            userContentfulData.value = contentfulData || null

            locationsStore.activeLocation =
                (contentfulData &&
                    'fields' in contentfulData &&
                    contentfulData.fields?.primaryLocation) ||
                null
        }
    }
    return {
        userData,
        userContentfulData,
        userMeta,
        setUserData
    }
})

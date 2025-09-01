import { defineStore } from 'pinia'

interface UserData {
    display_name?: string
    contentful_id?: string
    is_general_login?: boolean
}

export const useUserStore = defineStore('user', () => {
    const userData = ref<UserData | null>(null)
    const userContentfulData = ref<TypeEmployee | null>(null)
    const userMeta = ref<any>(null)

    const isGeneralLogin: ComputedRef<boolean> = computed(() => {
        return userData.value?.is_general_login || false
    })

    async function setUserData() {
        const locationsStore = useLocationsStore()

        const client = useSupabaseClient()

        const { data, error } = await client
            .from('profiles')
            .select('display_name, contentful_id, is_general_login')

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
            const contentfulData = await $fetch(
                '/api/contentful/fetch-entries',
                {
                    params: {
                        content_type: 'employee',
                        include: 1,
                        'sys.id': (userData.value as UserData).contentful_id
                    }
                }
            )

            userContentfulData.value = contentfulData.items[0] || null

            locationsStore.setActiveLocation(
                userContentfulData.value.fields.primaryLocation.sys.id || null
            )
        }
    }
    return {
        userData,
        userContentfulData,
        userMeta,
        isGeneralLogin,
        setUserData
    }
})

import { defineStore } from 'pinia'

// interface UserData {
//     display_name?: string
//     contentful_slug?: string
//     // Add other fields as needed
// }

export const useUserStore = defineStore('user', () => {
    const userData = ref<any>(null)
    const userContentfulData = ref<any>(null)
    const userMeta = ref<any>(null)

    async function setUserData() {
        const client = useSupabaseClient()
        const { data } = await client
            .from('profiles')
            .select('display_name, contentful_id')

        const user = useSupabaseUser()

        userMeta.value = user.value
        userData.value = data?.[0] || null

        if (userData.value?.contentful_id) {
            const contentfulData = await $fetch('/api/contentful/fetch-entry', {
                params: { id: userData.value.contentful_id }
            })
            userContentfulData.value = contentfulData || null
        }
    }
    return {
        userData,
        userContentfulData,
        userMeta,
        setUserData
    }
})

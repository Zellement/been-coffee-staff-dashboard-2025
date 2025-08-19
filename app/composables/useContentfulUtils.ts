export const useContentfulUtils = () => {
    const fetchEntry = async (entryId: string) => {
        try {
            return await $fetch(`/api/contentful/fetch-entry`, {
                method: 'GET',
                params: {
                    id: entryId
                }
            })
        } catch (error) {
            console.error('Error fetching entry by ID', error)
            return null
        }
    }
    return { fetchEntry }
}

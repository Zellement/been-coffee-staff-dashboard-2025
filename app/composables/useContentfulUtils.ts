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

    const fetchEntries = async (
        queryParams: Record<string, any>
    ): Promise<any> => {
        try {
            return await $fetch(`/api/contentful/fetch-entries`, {
                method: 'GET',
                params: queryParams
            })
        } catch (error) {
            console.error('Error fetching entries', error)
            return null
        }
    }

    const updateEntry = async (
        id: { id: string },
        body: Record<string, any>
    ) => {
        try {
            return await $fetch(`/api/contentful/update-entry`, {
                method: 'POST',
                body: {
                    id,
                    ...body
                }
            })
        } catch (error) {
            console.error('Error updating entry', error)
            return null
        }
    }

    return { fetchEntry, fetchEntries, updateEntry }
}

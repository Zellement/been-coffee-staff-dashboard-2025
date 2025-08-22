// export const useContentfulUtils = () => {
//     const fetchEntry = (entryId: string) => {
//         const { data, error } = useFetch(`/api/contentful/fetch-entry`, {
//             method: 'GET',
//             params: { id: entryId }
//         })
//         if (error.value) {
//             console.error('Error fetching entry by ID', error.value)
//             return null
//         }
//         return data
//     }

//     const fetchEntries = async (queryParams: Record<string, any>) => {
//         const { data, error } = await useFetch(
//             `/api/contentful/fetch-entries`,
//             {
//                 method: 'GET',
//                 params: queryParams
//             }
//         )
//         if (error.value) {
//             console.error('Error fetching entries', error.value)
//             return null
//         }
//         if (data.value) {
//             return data.value
//         }
//     }

//     const updateEntry = async (
//         id: { id: string },
//         body: Record<string, any>
//     ) => {
//         try {
//             return await $fetch(`/api/contentful/update-entry`, {
//                 method: 'POST',
//                 body: {
//                     id,
//                     ...body
//                 }
//             })
//         } catch (error) {
//             console.error('Error updating entry', error)
//             return null
//         }
//     }

//     return { fetchEntry, fetchEntries, updateEntry }
// }

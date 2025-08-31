export default defineNuxtRouteMiddleware(async () => {
    // Get all locations
    const locationsStore = useLocationsStore()

    if (locationsStore.allLocations && locationsStore.allLocations.length)
        return

    const locationData = await $fetch('/api/contentful/fetch-entries', {
        params: { content_type: 'location', include: 1 }
    })

    locationsStore.allLocations = locationData.items
    locationsStore.totalLocations = locationData.total

    // Lazy fetch, Get all employees
    const employeesStore = useEmployeesStore()

    if (employeesStore.allEmployees && employeesStore.allEmployees.length)
        return

    const employeeData = await $fetch('/api/contentful/fetch-entries', {
        params: {
            content_type: 'employee',
            include: 3,
            'fields.jobRole[nin]': '_ShopLogin'
        }
    })

    employeesStore.allEmployees = employeeData.items
    employeesStore.allLeads = employeeData.items
})

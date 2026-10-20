import { defineEventHandler } from 'h3'
import { requireUser } from '../../utils/require-user'

const REV_KEY = 'revision'

export default defineEventHandler(async (event) => {
    await requireUser(event)
    // Shared with the webhook across function instances
    const storage = useStorage('contentful')
    const rev = await storage.getItem<Revision>(REV_KEY)

    const defaultRev: Revision = {
        global: 0,
        buckets: {
            noticeBoard: 0,
            taskInstances: 0,
            beenAwesomeWinners: 0,
            dailyTasks: 0,
            routineTasks: 0,
            tableBookings: 0,
            orders: 0,
            assets: 0,
            singleTask: 0,
            employee: 0
        }
    }

    // Always return something
    return rev ?? defaultRev
})

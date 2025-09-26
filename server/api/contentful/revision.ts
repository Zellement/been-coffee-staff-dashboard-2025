import { defineEventHandler } from 'h3'
import { requireUser } from '../../utils/require-user'
const REV_KEY = 'contentful:revision'

export default defineEventHandler(async (event) => {
    await requireUser(event)
    const storage = useStorage()
    return (await storage.getItem(REV_KEY)) ?? null
})

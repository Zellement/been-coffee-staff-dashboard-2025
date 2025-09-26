// server/api/contentful/revision.get.ts
import { defineEventHandler } from 'h3'
import { requireUser } from '../../utils/require-user'

export default defineEventHandler(async (event) => {
    await requireUser(event) // keep staff-only
    const storage = useStorage()
    return (await storage.getItem('contentful:revision')) || { rev: 0 }
})

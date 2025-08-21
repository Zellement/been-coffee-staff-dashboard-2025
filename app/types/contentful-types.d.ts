import type * as ContentfulTypes from './contentful' // adjust path if needed

declare global {
    type TypeArticle = ContentfulTypes.TypeArticle
    type TypeBeenAwesomeWinner = ContentfulTypes.TypeBeenAwesomeWinner
    type TypeDailyTask = ContentfulTypes.TypeDailyTask
    type TypeEmployee = ContentfulTypes.TypeEmployee
    type TypeImageWithFocalPoint = ContentfulTypes.TypeImageWithFocalPoint
    type TypeLocation = ContentfulTypes.TypeLocation
    type TypeNoticeBoard = ContentfulTypes.TypeNoticeBoard
    type TypeOrder = ContentfulTypes.TypeOrder
    type TypeRole = ContentfulTypes.TypeRole
    type TypeRoutineTask = ContentfulTypes.TypeRoutineTask
    type TypeStandingOrder = ContentfulTypes.TypeStandingOrder
    type TypeSupplier = ContentfulTypes.TypeSupplier
    type TypeTableBooking = ContentfulTypes.TypeTableBooking
    type TypeTaskInstance = ContentfulTypes.TypeTaskInstance
}

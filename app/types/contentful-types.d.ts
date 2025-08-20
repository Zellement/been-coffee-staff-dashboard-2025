import type * as ContentfulTypes from './contentful' // adjust path if needed

declare global {
    type TypeArticle = ContentfulTypes.TypeArticle
    type TypeBeenAwesomeWinner = ContentfulTypes.TypeBeenAwesomeWinner
    type TypeEmployee = ContentfulTypes.TypeEmployee
    type TypeImageWithFocalPoint = ContentfulTypes.TypeImageWithFocalPoint
    type TypeLocation = ContentfulTypes.TypeLocation
    type TypeNoticeBoard = ContentfulTypes.TypeNoticeBoard
    type TypeOrder = ContentfulTypes.TypeOrder
    type TypeRole = ContentfulTypes.TypeRole
    type TypeRoutineTasks = ContentfulTypes.TypeRoutineTasks
    type TypeStandingOrder = ContentfulTypes.TypeStandingOrder
    type TypeSupplier = ContentfulTypes.TypeSupplier
    type TypeTableBookings = ContentfulTypes.TypeTableBookings
}

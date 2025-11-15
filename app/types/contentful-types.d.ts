import type * as ContentfulTypes from './contentful' // adjust path if needed

declare global {
    type TypeArticle = ContentfulTypes.TypeArticle
    type TypeArticleCategories = ContentfulTypes.TypeArticleCategories
    type TypeBeenAwesomeWinner = ContentfulTypes.TypeBeenAwesomeWinner
    type TypeDailyTask = ContentfulTypes.TypeDailyTask
    type TypeSetDayTask = ContentfulTypes.TypeSetDayTask
    type TypeEmployee = ContentfulTypes.TypeEmployee
    type TypeImageWithFocalPoint = ContentfulTypes.TypeImageWithFocalPoint
    type TypeLocation = ContentfulTypes.TypeLocation
    type TypeNoticeBoard = ContentfulTypes.TypeNoticeBoard
    type TypeOrder = ContentfulTypes.TypeOrder
    type TypeRole = ContentfulTypes.TypeRole
    type TypeRoutineTask = ContentfulTypes.TypeRoutineTask
    type TypeSingleTask = ContentfulTypes.TypeSingleTask
    type TypeStandingOrder = ContentfulTypes.TypeStandingOrder
    type TypeSupplier = ContentfulTypes.TypeSupplier
    type TypeTableBooking = ContentfulTypes.TypeTableBooking
    type TypeTaskInstance = ContentfulTypes.TypeTaskInstance
    type TypeRecipe = ContentfulTypes.TypeRecipe
    type TypeRecipeCategory = ContentfulTypes.TypeRecipeCategory
}

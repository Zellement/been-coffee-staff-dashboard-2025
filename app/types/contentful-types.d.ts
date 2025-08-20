import type * as ContentfulTypes from './contentful' // adjust path if needed

declare global {
    type TypeArticle = ContentfulTypes.TypeArticle
    type TypeBeenAwesomeWinner = ContentfulTypes.TypeBeenAwesomeWinner
    type TypeEmployee = ContentfulTypes.TypeEmployee
}

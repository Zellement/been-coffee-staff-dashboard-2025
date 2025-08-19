import type { RouteLocationNormalized } from 'vue-router'

export default {
    scrollBehavior(to: RouteLocationNormalized, from: RouteLocationNormalized) {
        if (to.path === from.path) return

        return { top: 0 }
    },
    strict: true,
    trailingSlash: false
}

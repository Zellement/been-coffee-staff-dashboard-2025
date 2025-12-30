import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
    /**
     * State
     **/
    const siteIsLoading: Ref<boolean> = ref(true)
    const showMobileNav: Ref<boolean> = ref(false)
    const animationsDisabled: Ref<boolean> = ref(false)
    const refreshing: Ref<boolean> = ref(false)
    const currentUrl: Ref<string> = ref('')

    /**
     * Getters
     **/

    /**
     * Actions
     **/
    const toggleShowMobileNav = (visible?: boolean) => {
        if (visible) {
            showMobileNav.value = visible
            return
        }
        showMobileNav.value = !showMobileNav.value
    }

    const toggleAnimationsDisabled = (visible?: boolean) => {
        if (visible) {
            animationsDisabled.value = visible
            return
        }
        animationsDisabled.value = !animationsDisabled.value
    }

    /**
     * Return
     **/
    return {
        siteIsLoading,
        showMobileNav,
        animationsDisabled,
        refreshing,
        currentUrl,
        toggleShowMobileNav,
        toggleAnimationsDisabled
    }
})

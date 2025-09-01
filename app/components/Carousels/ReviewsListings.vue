<template>
    <div class="p-default">
        <h2 class="uc-text uc-text--carousel-title">Reviews</h2>
        <u-carousel v-if="dataFetched" dots :items="reviewData">
            <template #default="{ item }">
                <u-card variant="solid">
                    <div class="mb-4 flex items-center gap-2">
                        <u-avatar
                            :src="item.authorPhoto ?? ''"
                            icon="i-lucide-image"
                            :alt="item.author ?? ''"
                            size="lg"
                        />
                        <div class="flex flex-col">
                            <p class="uc-text">{{ item.author }}</p>
                            <p>{{ fullDateConverter(item.createdAt) }}</p>
                        </div>
                    </div>

                    <div class="relative flex gap-1">
                        <Icon
                            v-for="i in 5"
                            :key="i"
                            name="ic:outline-star-outline"
                            class="text-butterscotch h-6 w-6 opacity-30"
                        />
                        <div class="absolute top-0 left-0 flex gap-1">
                            <Icon
                                v-for="i in item.rating"
                                :key="i"
                                name="ic:outline-star"
                                class="text-butterscotch h-6 w-6"
                            />
                        </div>
                    </div>
                    <h3 v-if="item.title" class="h5">{{ item.title }}</h3>
                    <p v-if="item.text" class="whitespace-pre-line">
                        {{ item.text }}
                    </p>
                    <u-alert
                        v-if="item.response?.text"
                        class="mt-4"
                        color="secondary"
                        title="Response"
                        variant="outline"
                        :description="item.response?.text"
                    />
                </u-card>
            </template>
        </u-carousel>
    </div>
</template>

<script lang="ts" setup>
interface NormalisedReview {
    id: string
    source: 'Google' | 'TripAdvisor'
    rating?: number | null
    title?: string | null
    text?: string | null
    author?: string | null
    authorProfileUrl?: string | null
    authorPhoto?: string | null
    link?: string | null
    createdAt: string // ISO
    updatedAt?: string | null
    response?: {
        text?: string | null
        createdAt?: string | null
        updatedAt?: string | null
    } | null
}

const locationsStore = useLocationsStore()

const reviewData = ref<NormalisedReview[]>([])
const dataFetched = ref(false)

const { uploadReviews } = useContentfulUtils()
const { fullDateConverter } = useDateUtils()

const activeLocation = computed<TypeLocation | null>(
    () => locationsStore.activeLocation
)

function isToday(d?: Date | string | null): boolean {
    if (!d) return false
    const now = new Date()
    const date = new Date(d)
    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    )
}

const lastFetched = computed(
    () => activeLocation.value?.fields?.reviewDataLastFetched ?? null
)

const shouldFetchReviews = computed(() => !isToday(lastFetched.value))

const googlePlaceId = computed(
    () => activeLocation.value?.fields?.googlePlaceId ?? null
)

const tripadvisorPlaceId = computed(
    () => (activeLocation.value?.fields as any)?.tripadvisorPlaceId ?? null
)

/* --- Normalisers -------------------------------------------------------- */
// Google -> NormalisedReview[]
function normalizeGoogle(res: any): NormalisedReview[] {
    const arr = Array.isArray(res?.reviews) ? res.reviews : []
    return arr.map(
        (r: any): NormalisedReview => ({
            id: String(r?.review_id ?? r?.link ?? cryptoRandomId()),
            source: 'Google',
            rating: r?.rating ?? null,
            text: r?.snippet ?? r?.extracted_snippet?.original ?? null,
            author: r?.user?.name ?? null,
            authorProfileUrl: r?.user?.link ?? null,
            authorPhoto: r?.user?.thumbnail ?? null,
            link: r?.link ?? null,
            createdAt: r?.iso_date ?? new Date().toISOString(),
            updatedAt: r?.iso_date_of_last_edit ?? r?.iso_date ?? null,
            response: r?.response
                ? {
                      text:
                          r?.response?.snippet ??
                          r?.response?.extracted_snippet?.original ??
                          null,
                      createdAt: r?.response?.iso_date ?? null,
                      updatedAt:
                          r?.response?.iso_date_of_last_edit ??
                          r?.response?.iso_date ??
                          null
                  }
                : null
        })
    )
}

// TripAdvisor -> NormalisedReview[]
function normalizeTripAdvisor(res: any): NormalisedReview[] {
    const arr = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : []

    return arr.map(
        (r: any): NormalisedReview => ({
            id: String(r?.id),
            source: 'TripAdvisor',
            rating: r?.rating ?? null,
            title: r?.title ?? null,
            text: r?.text ?? null,
            author: r?.user?.username ?? null,
            authorProfileUrl: null,
            authorPhoto: r?.user?.avatar?.thumbnail ?? null,
            link: r?.url ?? null,
            createdAt: r?.published_date ?? new Date().toISOString(),
            updatedAt: null,
            response: r?.owner_response
                ? {
                      text: r?.owner_response?.text ?? null,
                      createdAt: r?.owner_response?.published_date ?? null,
                      updatedAt: null
                  }
                : null
        })
    )
}

// quick ID for fallbacks
function cryptoRandomId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID()
    }
    return `rid_${Math.random().toString(36).slice(2)}`
}

// merge + de-dupe + sort by createdAt desc
function mergeAndSort(
    listA: NormalisedReview[],
    listB: NormalisedReview[]
): NormalisedReview[] {
    const merged = [...(listA ?? []), ...(listB ?? [])]
    const seen = new Set<string>()
    const deduped: NormalisedReview[] = []
    for (const r of merged) {
        const key = `${r.source}:${r.id}`
        if (!seen.has(key)) {
            seen.add(key)
            deduped.push(r)
        }
    }
    deduped.sort((a, b) => {
        const ta = Date.parse(a.createdAt || '')
        const tb = Date.parse(b.createdAt || '')

        const aBad = Number.isNaN(ta)
        const bBad = Number.isNaN(tb)

        // Put invalid dates at the end
        if (aBad && bBad) return 0
        if (aBad) return 1
        if (bBad) return -1

        // Newest first
        return tb - ta
    })

    return deduped
}

/* --- Fetchers ----------------------------------------------------------- */
async function fetchGoogleReviews(): Promise<NormalisedReview[]> {
    if (!googlePlaceId.value) return []
    try {
        const res = await $fetch('/api/reviews/serp-api-google-reviews', {
            method: 'GET',
            params: { place_id: googlePlaceId.value }
        })
        return normalizeGoogle(res)
    } catch (e) {
        console.warn('Google reviews fetch failed:', e)
        return []
    }
}

async function fetchTripadvisorReviews(): Promise<NormalisedReview[]> {
    if (!tripadvisorPlaceId.value) return []
    try {
        const res = await $fetch('/api/reviews/tripadvisor', {
            method: 'GET',
            params: { place_id: tripadvisorPlaceId.value }
        })
        console.log('TripAdvisor reviews fetched:', res)
        return normalizeTripAdvisor(res)
    } catch (e) {
        console.warn('TripAdvisor reviews fetch failed:', e)
        return []
    }
}

/* --- Initialisation / reactions ---------------------------------------- */
watch(
    [activeLocation, shouldFetchReviews],
    async () => {
        if (!activeLocation.value) return

        try {
            if (!shouldFetchReviews.value) {
                // Cached (already merged) reviews from Contentful
                const cached = activeLocation.value?.fields?.reviewData ?? []
                // If your cached data is already in the normalized shape, keep as-is.
                // If not, you can run a normaliser here as well.
                reviewData.value = Array.isArray(cached) ? cached : []
                dataFetched.value = true
                return
            }

            const [g, t] = await Promise.all([
                fetchGoogleReviews(),
                fetchTripadvisorReviews()
            ])
            const final = mergeAndSort(g, t)

            reviewData.value = final
            dataFetched.value = true

            if (activeLocation.value?.sys?.id) {
                try {
                    await uploadReviews(final, activeLocation.value.sys.id)
                } catch (e) {
                    console.warn('uploadReviews failed:', e)
                }
            }
        } catch (e) {
            console.error('Review watcher failed:', e)
        }
    },
    { immediate: true }
)
</script>

<template>
    <div v-if="hasReviews" class="p-default relative mb-8">
        <carousel-title-and-action title="Reviews">
            <div class="flex items-center">
                <u-switch
                    v-model="showDetails"
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    label="Details"
                    size="sm"
                    class="ml-auto"
                />
                <div class="ml-2 flex items-center gap-2">
                    <template
                        v-for="platform in reviewPlatforms"
                        :key="platform.key"
                    >
                        <u-badge
                            v-if="reviewMeta?.[platform.countKey]"
                            color="secondary"
                            class="flex flex-1 items-center whitespace-nowrap"
                            size="xs"
                        >
                            <u-icon :name="platform.icon" />
                            <template v-if="platform.ratingKey">
                                <u-icon name="ic:outline-star" />
                                <p class="mt-px">
                                    {{ reviewMeta?.[platform.ratingKey] }}
                                    ({{ reviewMeta?.[platform.countKey] }})
                                </p>
                            </template>
                            <p v-else class="mt-px">
                                {{ reviewMeta?.[platform.countKey] }}
                            </p>
                        </u-badge>
                    </template>
                </div>
            </div>
        </carousel-title-and-action>
        <div class="relative">
            <transition name="fade">
                <u-carousel
                    v-if="dataFetched"
                    v-slot="{ item }"
                    dots
                    :ui="{
                        root: 'flex',
                        container: 'items-stretch h-full',
                        item: 'h-full basis-4/5 flex sm:basis-1/2 lg:basis-1/3 2xl:basis-96'
                    }"
                    :items="reviewData"
                >
                    <u-card
                        variant="subtle"
                        :ui="{ root: 'h-full flex w-full' }"
                    >
                        <div class="mb-4 flex items-center gap-2">
                            <u-avatar-group>
                                <img
                                    v-if="item.authorPhoto"
                                    :src="item.authorPhoto ?? ''"
                                    :alt="item.author ?? ''"
                                    class="size-9 bg-tuscany-500"
                                />
                                <u-avatar
                                    :icon="
                                        item.source === 'Google'
                                            ? 'i-akar-icons-google-fill'
                                            : 'i-simple-icons-tripadvisor'
                                    "
                                    size="lg"
                                />
                            </u-avatar-group>
                            <div class="flex flex-col items-start gap-1">
                                <p class="uc-text">{{ item.author }}</p>
                                <u-badge
                                    variant="outline"
                                    :label="fullDateConverter(item.createdAt)"
                                />
                            </div>
                        </div>

                        <div class="relative mb-4 flex gap-1">
                            <u-icon
                                v-for="i in 5"
                                :key="i"
                                name="ic:outline-star-outline"
                                class="text-butterscotch-500 opacity-30"
                            />
                            <div class="absolute top-0 left-0 flex gap-1">
                                <u-icon
                                    v-for="i in item.rating"
                                    :key="i"
                                    name="ic:outline-star"
                                    class="text-butterscotch-500"
                                />
                            </div>
                        </div>

                        <div v-if="showDetails" class="flex flex-col gap-2">
                            <h3 v-if="item.title" class="h5">
                                {{ item.title }}
                            </h3>

                            <p v-if="item.text" class="whitespace-pre-line">
                                {{ item.text }}
                            </p>
                            <p v-else>No review left.</p>

                            <u-timeline
                                v-if="getDetails(item).length"
                                :items="getDetails(item)"
                                orientation="horizontal"
                                class="w-3/4"
                                :default-value="2"
                            />

                            <u-alert
                                v-if="item.response?.text"
                                class="mt-4"
                                color="info"
                                variant="soft"
                                :description="item.response?.text"
                            />
                        </div>
                    </u-card>
                </u-carousel>
            </transition>
            <transition name="fade-absolute">
                <skeleton-loop
                    v-if="!dataFetched"
                    skeleton-class="h-36 shrink-0 basis-4/5 sm:basis-1/2 lg:basis-1/3 2xl:basis-96"
                />
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { TimelineItem } from '@nuxt/ui'

interface NormalisedReview {
    id: string
    source: 'Google' | 'TripAdvisor'
    rating?: number | null
    title?: string | null
    text?: string | null
    author?: string | null
    authorProfileUrl?: string | null
    authorPhoto?: string | null
    createdAt: string // ISO
    details?: {
        food?: number | null
        service?: number | null
        atmosphere?: number | null
    }
    response?: {
        text?: string | null
    } | null
}

interface ReviewMeta {
    googleRating: number | null
    googleCount: number | null
    tripadvisorCount: number | null
}

interface PlaceInfo {
    rating: number | null
    reviews: number | null
}

type ReviewPlatformKey = 'google' | 'tripadvisor'
interface ReviewPlatform {
    key: ReviewPlatformKey
    icon: string
    ratingKey?: keyof ReviewMeta
    countKey: keyof ReviewMeta
}

const reviewPlatforms: ReviewPlatform[] = [
    {
        key: 'google',
        icon: 'i-akar-icons-google-fill',
        ratingKey: 'googleRating',
        countKey: 'googleCount'
    },
    {
        key: 'tripadvisor',
        icon: 'i-simple-icons-tripadvisor',
        countKey: 'tripadvisorCount'
    }
]

const getDetails = (item: NormalisedReview): TimelineItem[] => {
    const details: TimelineItem[] = []
    if (item.details?.food) {
        details.push({
            title: 'Food',
            icon: getRatingIcon(item.details.food)
        })
    }
    if (item.details?.service) {
        details.push({
            title: 'Service',
            icon: getRatingIcon(item.details.service)
        })
    }
    if (item.details?.atmosphere) {
        details.push({
            title: 'Atmosphere',
            icon: getRatingIcon(item.details.atmosphere)
        })
    }
    return details
}

const getRatingIcon = (rating: number): string => {
    if (rating === 5) return 'i-noto-v1-digit-five'
    if (rating === 4) return 'i-noto-v1-digit-four'
    if (rating === 3) return 'i-noto-v1-digit-three'
    if (rating === 2) return 'i-noto-v1-digit-two'
    return 'i-noto-v1-digit-one'
}

const locationsStore = useLocationsStore()

const reviewData = ref<NormalisedReview[]>([])
const reviewMeta = ref<ReviewMeta | null>(null)
const dataFetched: Ref<boolean> = ref(false)
const showDetails: Ref<boolean> = ref(false)

const hasReviews = computed(() => reviewData.value.length > 0)

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

const shouldFetchReviews = computed(
    () => !isToday(lastFetched.value) && locationsStore.safeToFetchAllData
)

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
            createdAt: r?.iso_date ?? new Date().toISOString(),
            details: {
                food: r?.details?.food ?? null,
                service: r?.details?.service ?? null,
                atmosphere: r?.details?.atmosphere ?? null
            },
            response: r?.response
                ? {
                      text:
                          r?.response?.snippet ??
                          r?.response?.extracted_snippet?.original ??
                          null
                  }
                : null
        })
    )
}

// SerpApi TripAdvisor -> NormalisedReview[]
function normalizeTripAdvisor(res: any): NormalisedReview[] {
    const arr = Array.isArray(res?.reviews) ? res.reviews : []
    const subrating = (r: any, label: string): number | null =>
        r?.additional_ratings?.find((a: any): boolean => a?.label === label)
            ?.rating ?? null

    return arr.map(
        (r: any): NormalisedReview => ({
            id: String(r?.review_id ?? r?.link ?? cryptoRandomId()),
            source: 'TripAdvisor',
            rating: r?.rating ?? null,
            title: r?.title ?? null,
            text: r?.snippet ?? null,
            author: r?.author?.display_name ?? r?.author?.username ?? null,
            authorProfileUrl: r?.author?.link ?? null,
            authorPhoto: r?.author?.avatar ?? null,
            createdAt: r?.date
                ? new Date(r.date).toISOString()
                : new Date().toISOString(),
            details: {
                food: subrating(r, 'Food'),
                service: subrating(r, 'Service'),
                atmosphere: subrating(r, 'Atmosphere')
            },
            response: r?.response
                ? {
                      text: r?.response?.snippet ?? null
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
async function fetchGoogleReviews(): Promise<{
    reviews: NormalisedReview[]
    meta: PlaceInfo
}> {
    if (!googlePlaceId.value)
        return { reviews: [], meta: { rating: null, reviews: null } }
    try {
        const res: {
            reviews?: any
            place_info?: { rating?: number | null; reviews?: number | null }
        } = await $fetch('/api/review-platforms/serp-api-google-reviews', {
            method: 'GET',
            params: { place_id: googlePlaceId.value }
        })

        return {
            reviews: normalizeGoogle(res),
            meta: {
                rating: res?.place_info?.rating ?? null,
                reviews: res?.place_info?.reviews ?? null
            }
        }
    } catch (e) {
        console.warn('Google reviews fetch failed:', e)
        return { reviews: [], meta: { rating: null, reviews: null } }
    }
}

async function fetchTripadvisorReviews(): Promise<{
    reviews: NormalisedReview[]
    meta: PlaceInfo
}> {
    if (!tripadvisorPlaceId.value)
        return { reviews: [], meta: { rating: null, reviews: null } }
    try {
        const res: {
            reviews?: any
            search_information?: { total_reviews?: number | null }
        } = await $fetch('/api/review-platforms/serp-api-tripadvisor-reviews', {
            method: 'GET',
            params: { place_id: tripadvisorPlaceId.value }
        })

        // Rating would need a second SerpApi call, so only the count is kept
        return {
            reviews: normalizeTripAdvisor(res),
            meta: {
                rating: null,
                reviews: res?.search_information?.total_reviews ?? null
            }
        }
    } catch (e) {
        console.warn('TripAdvisor reviews fetch failed:', e)
        return { reviews: [], meta: { rating: null, reviews: null } }
    }
}

/* --- Initialisation / reactions ---------------------------------------- */
watch(
    [
        activeLocation,
        googlePlaceId,
        tripadvisorPlaceId,
        lastFetched,
        () => locationsStore.safeToFetchAllData
    ],
    async () => {
        try {
            const location = activeLocation.value

            if (!location) {
                // no location yet; keep skeleton
                dataFetched.value = false
                return
            }

            // Use cached data if we shouldn't fetch now
            if (!shouldFetchReviews.value) {
                const cached = location.fields?.reviewData ?? []
                reviewData.value = Array.isArray(cached) ? cached : []
                reviewMeta.value = location.fields?.reviewMeta ?? null
                dataFetched.value = true
                return
            }

            // If we do want to fetch, but have no IDs yet, wait until they exist
            if (!googlePlaceId.value && !tripadvisorPlaceId.value) {
                dataFetched.value = false // still waiting for IDs
                return
            }

            dataFetched.value = false
            const [g, t] = await Promise.all([
                fetchGoogleReviews(),
                fetchTripadvisorReviews()
            ])

            const final = mergeAndSort(g.reviews, t.reviews)
            reviewData.value = final
            const meta = {
                googleRating: g.meta.rating,
                googleCount: g.meta.reviews,
                tripadvisorCount: t.meta.reviews
            }
            reviewMeta.value = meta

            dataFetched.value = true

            if (location.sys?.id) {
                try {
                    await uploadReviews(final, location.sys.id, meta)
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

<template>
    <div class="p-default relative mb-8">
        <carousel-title-and-action title="Reviews">
            <u-switch
                v-model="showDetails"
                unchecked-icon="i-lucide-x"
                checked-icon="i-lucide-check"
                label="Details"
                size="sm"
            />
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
                                    class="bg-tuscany-500 size-9"
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
                            <div class="flex flex-col">
                                <p class="uc-text">{{ item.author }}</p>
                                <p>{{ fullDateConverter(item.createdAt) }}</p>
                            </div>
                        </div>

                        <div class="relative mb-4 flex gap-1">
                            <u-icon
                                v-for="i in 5"
                                :key="i"
                                size="18"
                                name="ic:outline-star-outline"
                                class="text-butterscotch-500 opacity-30"
                            />
                            <div class="absolute top-0 left-0 flex gap-1">
                                <u-icon
                                    v-for="i in item.rating"
                                    :key="i"
                                    size="18"
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
                <div
                    v-if="!dataFetched"
                    class="flex w-full gap-4 overflow-hidden"
                >
                    <u-skeleton
                        v-for="i in 6"
                        :key="i"
                        class="h-36 shrink-0 basis-4/5 sm:basis-1/2 lg:basis-1/3 2xl:basis-96"
                    />
                </div>
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
const dataFetched: Ref<boolean> = ref(false)
const showDetails: Ref<boolean> = ref(false)

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
            createdAt: r?.published_date ?? new Date().toISOString(),
            response: r?.owner_response
                ? {
                      text: r?.owner_response?.text ?? null
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

            console.log('Fetching reviews...')

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

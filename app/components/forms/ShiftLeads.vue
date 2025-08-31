<template>
    <div class="shift-leads flex flex-col">
        <div v-if="hasTeam" class="flex flex-wrap gap-8">
            <label
                v-for="member in team"
                :key="member.sys.id"
                class="relative flex flex-row items-center gap-2 py-3"
            >
                <input
                    type="radio"
                    name="Team member"
                    :value="member.name"
                    class="ml-2 opacity-0"
                    required
                    @click="toggleIsOtherSelected(false)"
                />

                <div
                    class="shift-leads__img-wrapper absolute top-1/2 left-0 flex aspect-square h-12 w-12 -translate-y-1/2 overflow-hidden rounded-full p-1"
                >
                    <img
                        class="border-butterscotch-500 rounded-full border-2 object-cover"
                        :src="`${
                            member?.fields?.photo?.[0]?.fields?.file?.url
                        }?w=50&h=50&fit=fill&f=face&fm=webp`"
                        :alt="member?.fields?.name"
                    />
                </div>
                <span class="shift-leads__member-name pl-8 transition-all">
                    {{ member.fields.name }}
                </span>
            </label>
            <label class="relative flex flex-row items-center gap-2 py-3">
                <input
                    type="radio"
                    name="Team member"
                    required
                    value="Other"
                    class="ml-2 opacity-0"
                    @click="toggleIsOtherSelected(true)"
                />

                <div
                    class="shift-leads__img-wrapper absolute top-1/2 left-0 flex aspect-square h-12 w-12 -translate-y-1/2 overflow-hidden rounded-full p-1"
                >
                    <img
                        alt="Placeholder"
                        src="@/assets/images/been-staff-dashboard.png"
                        class="h-full w-full rounded-full object-cover"
                    />
                </div>
                <span class="pl-8">Other</span>
            </label>
            <label v-if="isOtherSelected" class="flex basis-full">
                <u-input
                    class="w-56 p-1"
                    type="text"
                    variant="outline"
                    placeholder="Hello, who are you?"
                    name="Other team member"
                />
            </label>
        </div>
    </div>
</template>

<script lang="ts" setup>
const locationsStore = useLocationsStore()

const leadEmployees: ComputedRef<TypeEmployee[] | null> = computed(() => {
    return locationsStore.getAllLeads
})

const isOtherSelected: Ref<boolean> = ref(false)

const toggleIsOtherSelected = (value: boolean) => {
    isOtherSelected.value = value ?? isOtherSelected.value
}

const hasTeam = computed(() => {
    return leadEmployees.value && leadEmployees.value.length > 0
})
const team = computed(() => {
    return leadEmployees.value
})
</script>

<style>
.shift-leads label {
    cursor: pointer;
}

.shift-leads__img-wrapper {
    pointer-events: none;
    filter: grayscale(1);
    transition-property: color, border-color, background-color, filter;
    transition-duration: 300ms;
}
.shift-leads input[type='radio']:checked + .shift-leads__img-wrapper {
    border-color: #1e293b; /* navy-500 */
    filter: none;
}
.dark .shift-leads input[type='radio']:checked + .shift-leads__img-wrapper {
    border-color: #b48a78; /* tuscany-500 */
}
.shift-leads input[type='radio']:checked ~ .shift-leads__member-name {
    color: #b48a78; /* tuscany-500 */
}
.dark .shift-leads input[type='radio']:checked ~ .shift-leads__member-name {
    color: #ffcb74; /* butterscotch-500 */
}
</style>

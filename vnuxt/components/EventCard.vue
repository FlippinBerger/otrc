<script setup lang="ts">
import type { OTRCEventCard } from '~/types'
import { RiChat3Fill, RiUserFill } from '@remixicon/vue'
interface Props {
    event: OTRCEventCard
}

const { event } = defineProps<Props>()
const eventLink = computed(() => {
    return `/events/${event.id}`
})

const time = computed(() => {
    const t = new Date(event.time);
    return t.toDateString() + ' @ ' + t.toLocaleTimeString()
})

const poster = computed(() => {
    return event.attendees.find((u) => u.id === event.poster)
})

</script>

<template>
    <NuxtLink :to=eventLink>
        <h1>{{ event.name }}</h1>
        <h2>{{ event.description }}</h2>
        <div>
            <p>{{ time }}</p>
            <p v-if="poster">Posted by {{ poster.username }}</p>
        </div>
        <div class='flex gap-2'>
            <span class='flex items-center gap-1'>
                <p>{{ event.comment_count }}</p>
                <RiChat3Fill color='white' size=17 />
            </span>
            <span class='flex items-center'>
                <p>{{ event.attendees.length }}</p>
                <RiUserFill color='white' size=17 />
            </span>
        </div>
    </NuxtLink>
</template>

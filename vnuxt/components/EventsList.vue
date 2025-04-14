<script setup lang="ts">
import type { OTRCEventCard } from '~/types'
interface Props {
    events: OTRCEventCard[] | null
}

const { events } = defineProps<Props>()
</script>

<template>
    <div class='flex flex-col items-center w-full'>
        <div v-if="events && events.length > 0" class='flex justify-center w-3/4'>
            <ul class='mt-4 flex flex-col gap-4'>
                <li v-for="event in events" :key="event.id">
                    <EventCard :event="event" />
                </li>
            </ul>
        </div>
        <div v-else class='bg-blue-200'>
            <h1>There are no upcoming events.</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { EventInfo, OTRCEventCard } from '~/types'
import { RiAddCircleLine } from '@remixicon/vue'

const cookie = useCookie('otrcSession')

const isLoggedIn = computed(() => {
    return !!cookie.value
})

const open = ref(false)

const { data: events, refresh: eventsRefresh } = await useFetch<OTRCEventCard[]>('http://localhost:3000/events')

const close = () => open.value = false

const errors = ref<string[]>([])

async function createEvent(eventInfo: EventInfo) {
    errors.value = []
    console.log('creating event');
    console.log(eventInfo);

    if (!eventInfo.name) {
        errors.value.push('no-name')
    }

    if (!eventInfo.type) {
        errors.value.push('no-type')
    }

    if (errors.value.length != 0) {
        return
    }

    try {
        // make the call
        const { status, error: resError } = await useFetch('http://localhost:3000/events', {
            method: 'POST',
            body: {
                name: eventInfo.name,
                type: eventInfo.type,
                time: eventInfo.time,
                description: eventInfo.description,
            },
            credentials: 'include',
        })

        if (resError.value && resError.value.statusCode == 401) {
            errors.value.push('not-logged-in')
        }

        if (errors.value.length === 0 && status.value === 'success') {
            // refetch
            await eventsRefresh()
            close();
        }
    } catch (e) {
        //TODO: write a utility class to throw this message everywhere needed
        console.log('contact the website maintainer with this error message:', e)
    }
}
</script>

<template>
    <div class='w-full'>
        <div v-if="isLoggedIn">
            <button @click="open = true">
                <RiAddCircleLine />
            </button>
        </div>
        <div v-else>
            <NuxtLink to="/login">
                <h3>Log in to create or interact with events</h3>
            </NuxtLink>
        </div>
        <EventsList :events="events" />
        <EventModal v-if="open" :errors="errors" @close=close @add-event="createEvent" />
    </div>
</template>

<script setup lang="ts">
import type { EventInfo, OTRCEventCard } from '~/types'
import { RiAddCircleLine } from '@remixicon/vue'

const user = useUser()
const token = useToken()
const conf = useRuntimeConfig()

const isLoggedIn = computed(() => {
    return !!user.value
})

const open = ref(false)

const { data: events, refresh: eventsRefresh, status: eventFetchStatus } = await useFetch<OTRCEventCard[]>(`${conf.public.apiBase}/events`, {
    lazy: true,
    headers: {
        Authorization: `Bearer: ${token.value}`
    },
})

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
        const { status, error: resError } = await useFetch(`${conf.public.apiBase}/events`, {
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
        <div v-if="eventFetchStatus === 'pending'">
            <p>Fetching data...</p>
        </div>
        <div v-else>
            <EventsList :events="events" />
            <EventModal v-if="open" :errors="errors" @close=close @add-event="createEvent" />
        </div>
    </div>
</template>

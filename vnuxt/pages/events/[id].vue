<script setup lang="ts">
import type { Comment, OTRCEvent, User } from '~/types'

const route = useRoute();
const conf = useRuntimeConfig();

const token = useToken();

const { data: event } = await useFetch<OTRCEvent>(`${conf.public.apiBase}/events/${route.params.id}`)

const { data: comments, refresh: refreshComments } = await useFetch<Comment[]>(`${conf.public.apiBase}/events/${route.params.id}/comments`)
const { data: attendees, refresh: refreshAttendees } = await useFetch<User[]>(`${conf.public.apiBase}/events/${route.params.id}/attendees`)

const expandComments = ref(true)

async function addComment(comment: string) {
    try {
        await $fetch(`${conf.public.apiBase}/events/${route.params.id}/comments`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer: ${token.value}`
            },
            body: {
                comment: comment
            },
            credentials: 'include'
        })

        await refreshComments()
    } catch (e) {
        console.log("Unable to addcomment", e)
    }
}

async function attend() {
    try {
        await $fetch(`${conf.public.apiBase}/events/${route.params.id}/attendees`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer: ${token.value}`
            },
            credentials: 'include',
        })

        await refreshAttendees();
    } catch (e) {
        console.log("Unable to attend", e)
    }
}

async function unattend() {
    try {
        await $fetch(`${conf.public.apiBase}/events/${route.params.id}/unattend`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer: ${token.value}`
            },
            credentials: 'include',
        })

        await refreshAttendees();
    } catch (e) {
        console.log("Unable to unattend", e)
    }
}

</script>

<template>
    <!--<div v-if="!!event" class='w-7/8 sm:w-3/4 flex flex-col items-center justify-center'>-->
    <div v-if="!!event" class='w-full flex flex-col items-center'>
        <div />
        <div class='grow w-7/8 sm:w-3/4'>
            <h1 class='text-4xl'>{{ event.name }}</h1>
            <p class='text-xl my-2'>{{ event.description }}</p>
            <AttendeesAccordion :attendees=attendees @attend="attend" @unattend="unattend" />
            <!--Comment box Component-->
            <CommentBox :open="expandComments" :comments=comments @add-comment="addComment"
                @comments-changed="refreshComments" />
        </div>
        <div />
    </div>
    <div v-else>
        <h1>This event doesn't exist or an error occurred</h1>
        <NuxtLink to='/events'>Go Back</NuxtLink>
    </div>
</template>

<style scoped></style>

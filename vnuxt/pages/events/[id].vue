<script setup lang="ts">
import type { Comment, OTRCEvent } from '~/types'

const route = useRoute();

const { data: event } = await useFetch<OTRCEvent>(`http://localhost:3000/events/${route.params.id}`)

const { data: comments } = await useFetch<Comment[]>(`http://localhost:3000/events/${route.params.id}/comments`)
const { data: attendees } = await useFetch(`http://localhost:3000/events/${route.params.id}/attendees`)

const expandAttendees = ref(false)
const expandComments = ref(true)

</script>

<template>
    <div v-if="!!event" class='w-7/8 sm:w-3/4 flex flex-col items-center justify-center'>
        <h1>{{ event.name }}</h1>
        <p class='mb-2'>{{ event.description }}</p>
        <!--Do a little fold out card here for the attendees -->
        <!--Comment box Component-->
        <CommentBox :open="expandComments" :comments=comments />
    </div>
    <div v-else>
        <h1>This event doesn't exist or an error occurred</h1>
        <NuxtLink to='/events'>Go Back</NuxtLink>
    </div>
</template>

<style scoped></style>

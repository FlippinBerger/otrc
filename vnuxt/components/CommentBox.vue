<script setup lang="ts">

import type { Comment } from '~/types'

interface Props {
    open: boolean
    comments: Comment[] | null
}
const { open } = defineProps<Props>()

defineEmits<{
    (e: 'addComment', comment: string): void
}>()

const cookie = useCookie('otrcSession')

const isLoggedIn = computed(() => {
    return !!cookie.value
})

const newComment = ref("")

</script>

<template>
    <div v-if="open" class='w-full flex flex-col justify-center'>
        <ul>
            <li v-for="comment in comments" :key="comment.id">
                <div class='flex gap-2'>
                    <h4>{{ comment.commenter }}</h4>
                    <h4>{{ comment.message }}</h4>
                </div>
            </li>
        </ul>
        <div class='flex gap-2 w-full'>
            <textarea
v-model="newComment" :rows=2 :cols=36 class='w-full focus:outline-none'
                placeholder="Write a comment..." />
            <button :class="{ disabled: !newComment }" @click="$emit('addComment', newComment)">Post</button>
        </div>
    </div>
    <div v-else>
        <h4>Comments</h4>
    </div>
</template>

<style scoped>
.disabled {
    color: #feffec;
    cursor: initial;
}
</style>

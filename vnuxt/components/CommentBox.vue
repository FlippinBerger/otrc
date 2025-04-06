<script setup lang="ts">

import type { Comment } from '~/types'

interface Props {
    open: boolean
    comments: Comment[] | null
}
const { open } = defineProps<Props>()

const emit = defineEmits<{
    (e: 'addComment', comment: string): void
}>()

const cookie = useCookie('otrcSession')

const isLoggedIn = computed(() => {
    return !!cookie.value
})

const newComment = ref("")

async function postComment() {
    if (!newComment.value) return
    emit('addComment', newComment.value);
    newComment.value = ''
}

</script>

<template>
    <div v-if="open" class='w-full flex flex-col justify-center'>
        <ul>
            <li v-for="comment in comments" :key="comment.id">
                <div class='flex flex-col gap-2 mb-2 border p-2 rounded-2xl border-[#9bfbcb] w-fit'>
                    <h3 class='font-bold'>{{ comment.username }}</h3>
                    <h3 class='text-xl'>{{ comment.message }}</h3>
                </div>
            </li>
        </ul>
        <div class='flex gap-2 w-full mt-2 mb-4'>
            <textarea
v-model="newComment" :rows=2 :cols=36 class='w-full focus:outline-none'
                placeholder="Write a comment..." />
            <button :class="{ disabled: !newComment, enabled: !!newComment }" @click="postComment">Post</button>
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

.enabled {
    text-decoration: underline
}
</style>

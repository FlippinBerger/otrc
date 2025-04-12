<script setup lang="ts">
import type { Comment } from '~/types'

interface Props {
    comment: Comment
}
const { comment } = defineProps<Props>()

const emit = defineEmits<{
    (e: 'commentsChanged'): void
}>()

const conf = useRuntimeConfig();
const user = useUser();
const token = useToken();

const isLoggedIn = computed(() => {
    return !!user.value
})

const isPoster = computed(() => {
    if (!user.value) {
        return false;
    }

    return +user.value == comment.user_id
})

const edit = () => {
    console.log('edit')
    open.value = false
    editing.value = true
}

const cancelEdit = () => {
    editing.value = false;
    updatedComment.value = comment.message
}

const confirmEdit = async () => {
    editing.value = false;
    //TODO: commit the edit

    try {
        await $fetch(`${conf.public.apiBase}/comments/${comment.id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer: ${token.value}`
            },
            body: {
                message: updatedComment.value
            },
            credentials: 'include'
        })

        emit('commentsChanged')
    } catch (e) {
        console.log("Unable to update comment", e)
    }
}

const report = () => {
    console.log('report')
}

const deleteComment = () => {
    console.log('delete')

    deleteModalOpen.value = true
}

const open = ref(false)
const toggle = () => open.value = !open.value

const editing = ref(false);
const updatedComment = ref(comment.message);
const deleteModalOpen = ref(false);

</script>

<template>
    <div class='flex mb-2 border p-2 rounded-2xl border-[#9bfbcb] w-fit'>
        <div class='flex flex-col gap-2'>
            <h3 class='font-bold'>{{ comment.username }}</h3>

            <h3 v-if="!editing" class='text-xl'>{{ comment.message }}</h3>
            <div v-else class='flex flex-col'>
                <textarea v-model="updatedComment" />
                <div class='self-center flex gap-2'>
                    <button @click="confirmEdit">Confirm</button>
                    <button @click="cancelEdit">Cancel</button>
                </div>
            </div>
        </div>
        <div v-if="isLoggedIn && !open">
            <button @click="toggle">...</button>
        </div>
        <div v-else-if="isLoggedIn && open" class='float-right modal'>
            <ul class='flex flex-col size-full m-0 p-0'>
                <li class='item self-end'><button class='btn' @click="toggle">X</button></li>
                <li v-if="isPoster" class='item' @click="edit">Edit</li>
                <li v-if="isPoster" class='item' @click="deleteComment">Delete</li>
                <li class='item' @click="report">Report</li>
            </ul>

        </div>
    </div>

</template>

<style scoped>
.modal {
    background-color: #feffec;
    border-radius: 4px;
}

.btn {
    color: black;
}

.item {
    color: black;
}

.item:hover {
    background-color: lightblue;
    cursor: pointer;
}
</style>

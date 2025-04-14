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
    open.value = false
    editing.value = true
}

const cancelEdit = () => {
    editing.value = false;
    updatedComment.value = comment.message
}

const confirmEdit = async () => {
    editing.value = false;
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

const report = async () => {
    try {
        await $fetch(`${conf.public.apiBase}/comments/${comment.id}/report`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer: ${token.value}`
            },
            credentials: 'include'
        })

        emit('commentsChanged')
    } catch (e) {
        console.log("Unable to update comment", e)
    }
}

const deleteComment = async () => {
    try {
        await $fetch(`${conf.public.apiBase}/comments/${comment.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer: ${token.value}`
            },
            credentials: 'include'
        })

        emit('commentsChanged')
    } catch (e) {
        console.log("Unable to delete comment", e)
    }

    confirmModalOpen.value = true
}

const open = ref(false)
const toggle = () => open.value = !open.value

const editing = ref(false);
const updatedComment = ref(comment.message);

type ConfirmType = 'delete' | 'report';
const confirmModalOpen = ref(false);
const confirmType = ref<ConfirmType>('delete')

const popConfirmModal = (t: ConfirmType) => {
    confirmModalOpen.value = true;
    confirmType.value = t
}

const confirmDeny = () => {
    closePopups();
}

const confirmConfirm = async () => {
    closePopups();

    if (confirmType.value === 'delete') {
        await deleteComment();
    } else if (confirmType.value === 'report') {
        await report();
    }
}

const closePopups = () => {
    open.value = false;
    confirmModalOpen.value = false;
}

</script>

<template>
    <div class='flex gap-4 mb-2 border p-2 rounded-2xl border-[#9bfbcb] w-fit'>
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
        <div v-else-if="isLoggedIn && open" class='modal border rounded border-sky-600 h-fit'>
            <ul class='flex flex-col p-1'>
                <li class='item self-end'><button class='btn' @click="closePopups">X</button></li>
                <li v-if="isPoster" class='item' @click="edit">Edit</li>
                <li v-if="isPoster" class='item' @click="popConfirmModal('delete')">Delete</li>
                <li v-else class='item' @click="popConfirmModal('report')">Report</li>
            </ul>
        </div>
    </div>

    <ConfirmModal v-if='confirmModalOpen' :confirm-type="confirmType" @confirm='confirmConfirm' @deny='confirmDeny' />

</template>

<style scoped>
.modal {
    background-color: #cb9bfb;
    position: relative;
}

.btn {
    color: black;
}

.btn:hover {
    color: #9bfbcb;
}

.item {
    color: black;
}

.item:hover {
    color: #9bfbcb;
    cursor: pointer;
}
</style>

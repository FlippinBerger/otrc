<script setup lang="ts">
defineEmits(['confirm', 'deny'])

interface Props {
    confirmType: string
}

const { confirmType } = defineProps<Props>()

</script>

<template>
    <div class='overlay bg-[#28282B] opacity-80 no-scroll'>
        <Teleport to='body'>
            <div class='confirm p-4 border border-[#9bfbcb] rounded-2xl z-50'>
                <h2 class='text-2xl pb-4'>Are you sure you want to {{ confirmType }} this comment?</h2>
                <div class='flex gap-2 justify-around'>
                    <button class='hover:text-pink-400 text-3xl' @click="$emit('confirm')">Yes</button>
                    <button class='text-3xl' @click="$emit('deny')">No</button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.confirm {
    background-color: #232b2b;
    padding: 24px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}


.overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
}
</style>

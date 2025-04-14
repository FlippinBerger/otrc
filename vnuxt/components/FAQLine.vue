<script setup lang="ts">
interface Props {
    q: string
    a: string
}

const { q, a } = defineProps<Props>()
</script>

<template>
    <div className='mb-8 sm:mb-12'>
        <h2 className='text-2xl sm:text-3xl mb-2 font-bold'>{{ q }}</h2>
        <h3 className='text-xl sm:text-xl'>{{ a }}</h3>
    </div>
</template>

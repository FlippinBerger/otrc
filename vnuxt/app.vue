<script setup lang="ts">
const user = useUser();
onBeforeMount(() => {
    user.value = localStorage.getItem('userId');
})
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

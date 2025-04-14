<script setup lang="ts">
definePageMeta({
    layout: false
});

const user = useUser();
const accessToken = useToken();
const conf = useRuntimeConfig()

const username = ref("")
const password = ref("")

async function loginSubmit() {
    const res = await $fetch<{ user_id: string, token: string }>(`${conf.public.apiBase}/login`, {
        method: 'POST',
        body: {
            username: username.value,
            password: password.value,
        },
        credentials: 'include'
    })

    user.value = res.user_id;
    accessToken.value = res.token;
    localStorage.setItem('userId', res.user_id);

    // refresh cookie and nav back to home
    refreshCookie('refreshToken')
    await navigateTo('/')
}
</script>

<template>
    <div class='w-full h-full flex flex-col justify-center items-center absolute bottom-0 gap-2'>
        <input v-model="username" placeholder="username" class='focus:outline-none'>
        <input v-model="password" type='password' placeholder="password" class='focus:outline-none'>

        <button class='text-white outline rounded p-1' @click="loginSubmit">Login</button>

        <span class='mt-8 flex gap-2'>
            <h2>Not yet signed up?</h2>
            <NuxtLink to="/register" class='text-white underline'>Register here</NuxtLink>
        </span>
        <NuxtLink to="/" class='text-white underline'>Back to OTRC</NuxtLink>
    </div>
</template>

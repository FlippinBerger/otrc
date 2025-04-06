<script setup lang="ts">
definePageMeta({
    layout: false
});
const username = ref("")
const email = ref("")
const password = ref("")
const passwordConfirm = ref("")

const user = useUser();

const passwordsMatch = computed(() => {
    return password.value === passwordConfirm.value
})

const fieldsFilled = computed(() => {
    return username.value && email.value && password.value
})

async function registerSubmit() {
    console.log(`registering ${username.value} and ${password.value} match: ${passwordsMatch.value} with email ${email.value}`);

    if (!passwordsMatch.value) {
        return;
    }

    if (!fieldsFilled.value) {
        return
    }

    const res = await $fetch<{ user_id: string }>('http://localhost:3000/signup', {
        method: 'POST',
        body: {
            username: username.value,
            password: password.value,
            email: email.value,
        },
        credentials: 'include'
    })

    user.value = res.user_id;
    localStorage.setItem('userId', res.user_id);

    // refresh cookie and nav back to home
    refreshCookie('otrcSession')
    await navigateTo('/')
}
</script>

<template>
    <div class='w-full h-full flex flex-col justify-center items-center absolute bottom-0 gap-2'>
        <input v-model="username" placeholder="username" class='focus:outline-none'>
        <input v-model="email" placeholder="email" class='focus:outline-none'>
        <input v-model="password" type='password' placeholder="password" class='focus:outline-none'>
        <input v-model="passwordConfirm" type='password' placeholder="confirm password" class='focus:outline-none'>

        <button class='text-white outline rounded p-1' @click="registerSubmit">Sign up</button>

        <span class='mt-8 flex gap-2'>
            <h2>Already signed up?</h2>
            <NuxtLink to='/login' class='text-white underline'>Log in here</NuxtLink>
        </span>
        <NuxtLink to="/" class='text-white underline'>Back to OTRC</NuxtLink>
    </div>
</template>

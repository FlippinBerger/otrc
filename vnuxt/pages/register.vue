<script setup lang="ts">
import { FetchError } from 'ofetch';

definePageMeta({
    layout: false
});
const username = ref("")
const email = ref("")
const password = ref("")
const passwordConfirm = ref("")

const errors = ref<string[]>([]);

const user = useUser();
const token = useToken();
const conf = useRuntimeConfig();

const passwordsMatch = computed(() => {
    return password.value === passwordConfirm.value
})

const fieldsFilled = computed(() => {
    return username.value && email.value && password.value
})

const getErrorMessage = (err: string): string => {
    if (err == 'password-match') {
        return "Passwords don't match";
    }

    if (err == 'fill-forms') {
        return "All fields must be filled out";
    }

    if (err == 'username-taken') {
        return 'This username is already in use.'
    }
    if (err == 'email-taken') {
        return 'This email address is already in use.'
    }
    if (err == 'oops') {
        return "Something went wrong, if this is the only error please try again. If it continues, contact the maintainer"
    }

    return ""
}

async function registerSubmit() {
    errors.value = [];
    if (!passwordsMatch.value) {
        errors.value.push("password-match");
    }

    if (!fieldsFilled.value) {
        errors.value.push("fill-forms")
    }

    if (errors.value.length > 0) {
        return
    }

    try {
        const res = await $fetch<{ user_id: string, token: string }>(`${conf.public.apiBase}/signup`, {
            method: 'POST',
            body: {
                username: username.value,
                password: password.value,
                email: email.value,
            },
            credentials: 'include',
        })

        user.value = res.user_id;
        token.value = res.token;
        localStorage.setItem('userId', res.user_id);

        await navigateTo('/')
    } catch (e) {
        if (e instanceof FetchError && e.statusCode == 409) {
            const message = e.response!._data.message;
            if (message.includes('username')) {
                errors.value.push('username-taken');
            }
            if (message.includes('email')) {
                errors.value.push('email-taken');
            }

            return;
        }

        errors.value.push('oops')
    }
}
</script>

<template>
    <div class='w-full h-full flex flex-col justify-center items-center absolute bottom-0 gap-2'>
        <div v-if="errors.length > 0">
            <ul>
                <li v-for="error in errors" :key="error" class='err'>
                    {{ getErrorMessage(error) }}
                </li>
            </ul>
        </div>
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

<style scoped>
.err {
    color: red;
}
</style>

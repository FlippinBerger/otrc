<script setup lang="ts">
import { RiInstagramLine } from '@remixicon/vue'

const sessionCookie = useCookie('otrcSession');
const user = useUser();

const isLoggedIn = computed(() => {
    return !!sessionCookie.value
})

async function logout() {
    try {
        const res = await $fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include'
        })

        sessionCookie.value = null;
        localStorage.removeItem('userId');

    } catch (e) {
        console.log('unable to logout', e);
    }

    await navigateTo('/')
}

</script>

<template>
    <div class='flex justify-between items-center py-4'>
        <ul class='flex gap-4 text-[#feffec]'>
            <li>
                <a href='https://www.instagram.com/oldtownrunclubfc/' target='_blank'>
                    <RiInstagramLine size=27 />
                </a>
            </li>
            <li>
                <a href='https://www.strava.com/clubs/1286057' target='_blank'>
                    <img src='~/assets/img/strava.svg' alt='Strava' height='24' width='24'>
                </a>
            </li>
        </ul>
        <ul class='flex gap-4 justify-around text-[#FBCB9B]'>
            <li class='p-1'>
                <NuxtLink to='/'>
                    Home
                </NuxtLink>
            </li>
            <li class='p-1'>
                <NuxtLink to='/events'>
                    Events
                </NuxtLink>
            </li>
            <li class='p-1'>
                <NuxtLink to='/faq'>
                    FAQ
                </NuxtLink>
            </li>
            <li v-if="!isLoggedIn" class='p-1 text-[#9bfbcb]'>
                <NuxtLink to='/login' class='outline rounded p-1'>
                    Sign In
                </NuxtLink>
            </li>
            <li v-else class='text-[#9bfbcb]'>
                <button class='outline rounded p-1' @click="logout">Sign Out</button>
            </li>
        </ul>
    </div>
</template>

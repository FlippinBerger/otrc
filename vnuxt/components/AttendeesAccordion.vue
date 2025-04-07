<script setup lang="ts">
import { RiArrowDownSLine, RiCloseLargeFill } from '@remixicon/vue'
import type { User } from '~/types'

interface Props {
    attendees: User[] | null
}
const { attendees } = defineProps<Props>()

defineEmits(['attend', 'unattend']);

const user = useUser();

const open = ref(false)

const nameDisplay = computed(() => {
    if (!attendees) {
        return 'No one is currently attending'
    }
    if (attendees.length < 4) {
        const names = attendees.map((a) => a.username);
        const multiple = attendees.length > 1;
        const additional = multiple ? 'are going' : 'is going'

        if (multiple) {
            const newNames = names.slice(0, names.length - 1)
            let s = newNames.join(", ")
            s += ' and ' + names[names.length - 1]
            return s + ' ' + additional;
        }
        return names.join(", ") + ' ' + additional;
    } else {
        const firstFewNames = attendees.slice(0, 3).map((a) => a.username).join(", ");
        return firstFewNames + ` and ${attendees.length - 3} more are going`
    }
})

const isAttending = computed(() => {
    if (!user.value) {
        return false;
    }

    const num = +user.value
    console.log('user value as number is', num);

    const a = attendees!.filter((u) => u.id == num)
    return a.length > 0;
})

</script>

<template>
    <div class='mb-4'>
        <div v-if="attendees!.length < 1" class='flex justify-between items-center'>
            <h1>No one is currently attending</h1>
            <button class='attendBtn p-2' @click="$emit('attend')">
                <h1>I'm going</h1>
            </button>
        </div>
        <div v-else class='w-full'>
            <div class='flex gap-3 justify-between hover:cursor-pointer' @click="open = !open">
                <h1 v-if="!open">{{ nameDisplay }}</h1>
                <div v-else>
                    <ul>
                        <li v-for="attendee in attendees" :key=attendee.id>
                            <h1>
                                {{ attendee.username }}
                            </h1>
                        </li>
                    </ul>
                </div>
                <div class='flex gap-2'>
                    <div v-if="isAttending">
                        <button class='attendBtn p-2' @click="$emit('unattend')">
                            <h1>I'm not going</h1>
                        </button>
                    </div>
                    <div v-else>
                        <button class='attendBtn p-2' @click="$emit('attend')">
                            <h1>I'm going</h1>
                        </button>
                    </div>
                    <button class="self-start">
                        <div v-if="!open">
                            <RiArrowDownSLine color='#9bfbcb' />
                        </div>
                        <div v-else>
                            <RiCloseLargeFill color='#9bfbcb' />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.attendBtn {
    padding: 4;
    border: solid;
    border-radius: 4px;
}
</style>

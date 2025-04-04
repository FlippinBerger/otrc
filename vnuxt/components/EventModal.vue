<script setup lang="ts">
import { RiCloseLargeFill } from '@remixicon/vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import type { EventInfo } from '~/types'

interface Props {
    errors: string[]
}

const { errors } = defineProps<Props>()

defineEmits<{
    (e: 'close'): void
    (e: 'addEvent', event: EventInfo): void
}>()

const now = new Date()
const formattedDate = now.toISOString().slice(0, 16)

const name = ref("")
const description = ref("")
const date = ref(formattedDate)
const type = ref("")
const options = ref([
    { text: 'Race', value: 'race' },
    { text: 'Training run', value: 'training' },
    { text: 'Fun run', value: 'fun-run' },
    { text: 'Hang out', value: 'hang' },
])

// use this to stop event propagation but allow the user
// to click off the modal to close it
const eatIt = () => { }

const eventInfo = computed(() => {
    return {
        name: name.value,
        type: type.value,
        time: new Date(date.value),
        description: description.value
    }
})

const nameError = computed(() => {
    return errors.includes('no-name')
})

const typeError = computed(() => {
    return errors.includes('no-type')
})

const authError = computed(() => {
    return errors.includes('not-logged-in')
})

</script>

<template>
    <div class='overlay' @click="$emit('close')">
        <div class='h-full flex flex-col justify-center'>
            <div />
            <div class='modal rounded-xl flex flex-col w-7/8 sm:w-3/4 justify-center mx-auto' @click.stop="eatIt">
                <div class='flex justify-between'>
                    <h1>Create an Event</h1>
                    <button @click="$emit('close')">
                        <RiCloseLargeFill />
                    </button>
                </div>
                <div v-if="authError" class='error border'>
                    <h2>Log in and try again</h2>
                </div>
                <input v-model="name" placeholder='Event name' class='focus:outline-none' :class="{ error: nameError }">
                <VueDatePicker v-model="date" time-picker-inline :is24=false dark :clearable=false />
                <select v-model="type" class='my-4' :class="{ error: typeError }">
                    <option disabled value="">Event type</option>
                    <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}
                    </option>
                </select>

                <textarea v-model="description" class='focus:outline-none' placeholder='Event info' :rows=5 />

                <button
class='mt-4 p-1 border rounded w-1/4 self-center'
                    @click="$emit('addEvent', eventInfo)">Create</button>
            </div>
            <div />
        </div>
    </div>
</template>

<style scoped>
/*stuff for the datepicker*/
.dp__theme_dark {
    padding-right: 8px;
    --dp-text-color: #9bfbcb;
    --dp-primary-color: #9bfbcb;
    --dp-primary-text-color: #feffec;
    --dp-secondary-color: #feffec;
    --dp-border-color: #9bfbcb;
    --dp-menu-border-color: #9bfbcb;
    --dp-border-color-hover: #9bfbcb;
    --dp-border-color-focus: #9bfbcb;
    --dp-icon-color: #9bfbcb;
}

.overlay {
    background-color: rgba(256, 256, 256, 0.6);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.modal {
    background-color: #232b2b;
    padding: 8px;
}

.error {
    border-color: red;
}
</style>

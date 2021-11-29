
import { computed, watchEffect } from 'vue'
import { usePreferredDark, useStorage } from '@vueuse/core'


const DARK_MODE_BODY_CLASS = 'is-dark'
const preferredDark = usePreferredDark()

export const colorSchema = useStorage('color-schema', 'auto')


export const isDark = computed({
    get() {
        return colorSchema?.value === 'auto'
            ? preferredDark?.value
            : colorSchema?.value === 'dark'
    },
    set(v) {
        if (v === preferredDark.value) colorSchema.value = 'auto'
        else colorSchema.value = v ? 'dark' : 'light'
    },
})

export const useDarkModeHandler = (event) => {
    const target = event.target
    isDark.value = !target.checked
}

/**
 * watchEffect callbacks will be executed each time used reactives value has changed
 */
watchEffect(() => {
    const body = document.documentElement
    if (isDark.value) {
        body.classList.add(DARK_MODE_BODY_CLASS)
    } else {
        body.classList.remove(DARK_MODE_BODY_CLASS)
    }
})

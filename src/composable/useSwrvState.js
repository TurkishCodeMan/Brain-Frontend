import { ref, watchEffect } from 'vue'

const STATES = {
    VALIDATING: 'VALIDATING',
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    STALE_IF_ERROR: 'STALE_IF_ERROR',
}

export default function (data, error, isValidating) {
    const state = ref('idle')
    const isLoading = ref(false)
    const isError = ref(false)
    const isSuccess = ref(false)


    watchEffect(() => {
        if (data.value && isValidating.value) {
            state.value = STATES.VALIDATING

            return
        }
        if (data.value && error.value) {
            state.value = STATES.STALE_IF_ERROR

            return
        }
        if (data.value === undefined && !error.value) {
            state.value = STATES.PENDING


            return
        }
        if (data.value && !error.value) {
            state.value = STATES.SUCCESS

            return
        }
        if (data.value === undefined && error) {
            state.value = STATES.ERROR

            return
        }

    })


    watchEffect(() => {
        isLoading.value = [STATES.PENDING].includes(state.value)
        isError.value = [STATES.ERROR, STATES.STALE_IF_ERROR].includes(state.value)
        isSuccess.value = [STATES.SUCCESS, STATES.VALIDATING, STATES.STALE_IF_ERROR].includes(state.value)
    })


    return {
        state,
        data,
        STATES,
        isLoading,
        isError,
        isSuccess
    }
}
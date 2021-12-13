import { reactive, toRefs, ref, watchEffect } from "vue"
import sleep from "@/utils/sleep";


const defaultInitialState = {
    status: 'idle',
    data: null,
    error: null,

}

function useAsync(initialState) {

    const state = reactive({
        ...defaultInitialState,
        ...initialState
    })

    const isLoading = ref(false)
    const isIdle = ref(false)
    const isError = ref(false)
    const isSuccess = ref(false)

    watchEffect(() => {
        isLoading.value = state.status === 'pending'
        isIdle.value = state.status === 'idle'
        isError.value = state.status === 'rejected'
        isSuccess.value = state.status === 'resolved'
    }, [state.status])



    function setData(newData) {
        state.status = "resolved"
        state.data = newData
    }
    function setError(newError) {
        state.status = "rejected"
        state.error = newError
    }
    function reset() {
        state.status = defaultInitialState.status
        state.data = defaultInitialState.data
        state.error = defaultInitialState.error
    }

    async function run(promise) {
        if (!promise || !promise.then) {
            throw new Error(`The argument passed to useAsync().run must be a promise.`)
        }
        state.status = "pending"
        await sleep(1000)
        return promise.then(
            newData => {

                setData(newData)
                return newData
            },
            newError => {

                setError(newError)
                // return Promise.reject(newError)
            }
        )
    }





    return {
        // using the same names that react-query uses for convenience
        ...toRefs(
            state,
        ),

        ...toRefs({
            isLoading,
            isIdle,
            isError,
            isSuccess
        }),
        setData,
        setError,
        run,
        reset,
    }
}

export { useAsync }




import { useClient } from "@/utils/apiClient";
import useSWRV from "swrv";
import useSwrvState from "@/composable/useSwrvState";
import { toRefs } from "vue"

function useUserFolders({ options = {}, id }) {
    const client = useClient()

    const fetcher = function () {

        return client(
            `getZips?id=${id}`
        ).then((data) => data);
    };

    const { data, error, isValidating } =
        useSWRV("user-folder", fetcher);

    const result = useSwrvState(data, error, isValidating);
    return toRefs(
        result
    )

}


function useUploadFile(options = {}) {
    const client = useClient()

    return (fetcher) => useSWRV("invoice", fetcher);

}

export { useUploadFile, useUserFolders }
import { useClient } from "@/utils/apiClient";

async function useUserFolders({ options = {}, id }) {
    const client = useClient()

    const fetcher = function async () {
        return client(
            `getZips?id=${id}`
        ).then((data) => data);
    };

    const result=await fetcher();

    return result

}





export { useUserFolders }
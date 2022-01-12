import { useClient } from "@/utils/apiClient";
import { getToken } from "./authProvider";

async function useUserFolders({ options = {}, id }) {
    const client = useClient()
    const token=getToken()
    const fetcher = function async() {
        return client(`?token=${token}`, 
        { method: 'GET', token })
        .then(data=>data.folders)

    };

    const result = await fetcher();

    return result

}





export { useUserFolders }
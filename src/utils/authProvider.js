import useNotyf from "@/composable/useNotyf"
import { useRouter } from "vue-router"

const authURL = "https://dev.api.dsumma.com/v1"
const localStorageKey = "my__token"
const localStorageUser = 'my__user'



function getToken() {
    return window.localStorage.getItem(localStorageKey);
}

async function getUser(queryClient) {
    const token = getToken();

    if (token) {
        return {value:{name:'Deneme'}}
        //return fetchUser(token);
    }
    handleUserResponse({AccessToken:'tokenn'})
   
    // else {
    //     return Promise.reject('Token is not find')
    // }
}



function handleUserResponse(res) {
    if (!res.AccessToken) {
        const notif = useNotyf();
        notif.error('Please check credentials !')
        return Promise.reject("User Not Found !")
    }
    window.localStorage.setItem(localStorageKey, res.AccessToken)
    return res.AccessToken;
}

function userResponse(res) {
    return res.User;
}


async function login({ username, password }) {
    return client('authentication/login',
        { data: { Username: username, Password: btoa(password) } })
        .then(handleUserResponse)
        .then(fetchUser)

}

function fetchUser(token) {

    return client('identity/user', { method: 'GET', token }).then(userResponse)
}

function register({ username, password }) {
    return client('user/register', { data: { username, password } }).then(handleUserResponse)
}

async function logout() {
    window.localStorage.removeItem(localStorageKey);
    window.localStorage.removeItem(localStorageUser);
}



async function client(endpoint, { data, token, ...options } = {}) {

    const config = {
        method: 'POST',
        body: data ? JSON.stringify(data) : null,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined,
            'CompanyId': 'b8da8bef-b97c-ea11-a2cf-00505692fd9d'
        },
        ...options
    }

    return window.fetch(`${authURL}/${endpoint}`, config).then(async response => {
        if (response.status === 401) {
            await logout()
            return Promise.reject({ message: 'Please re-authenticate.' })
        }

        const data = await response.json()
        if (response.ok) {
            return data
        } else {
            return Promise.reject(data)
        }
    })
}

export { getToken, getUser, login, register, logout, localStorageKey }

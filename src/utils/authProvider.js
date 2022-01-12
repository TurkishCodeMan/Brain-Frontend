import useNotyf from "@/composable/useNotyf"
import { useRouter } from "vue-router"

//const authURL = 'http://www.medical-structures.com:8000/api'
const authURL = 'http://localhost:8000/api'
const localStorageKey = "my__token"
const localStorageUser = 'my__user'



function getToken() {
    return window.localStorage.getItem(localStorageKey);
}

async function getUser() {
    const token = getToken();

    if (token) {
         return fetchUser(token);
    }

    else {
        return Promise.reject('Token is not find')
    }
}



function handleUserResponse(res) {
    console.log(res)
    const notif = useNotyf();

    if (!res.status) {
        notif.error('Please check credentials !')
        return Promise.reject("User Not Found !")
    }
    window.localStorage.setItem(localStorageKey, res.token)
    return res.token;

}

function userResponse(res) {
    console.log(res)
    return res.user
}


async function login({ username, password }) {
    return client('login',
        { data: { email: username, password: password } })
        .then(handleUserResponse)
        .then(fetchUser)


}

function fetchUser(token) {
    console.log(token)
    return client(`?token=${token}`, { method: 'GET', token }).then(userResponse)
}

function register({ first_name, last_name, email, password }) {
    return client('register', { data: { first_name, last_name, email, password } })
    .then(user=>user)
}

async function logout() {
    window.localStorage.removeItem(localStorageKey);
    window.localStorage.removeItem(localStorageUser);
}

function manuelLogout(){
    const token=getToken()
    logout()
    return client("logout",{token}).then(res=>res)
}


async function client(endpoint, { data, token, ...options } = {}) {

    const config = {
        method: 'POST',
        body: data ? JSON.stringify(data) : null,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined,
            'x-access-token':token?token:undefined,
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

export { getToken, getUser, login, register, logout,manuelLogout, localStorageKey }

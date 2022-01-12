import * as auth from './authProvider';

//const apiURL = 'http://www.medical-structures.com:8000/api'
const apiURL = 'http://localhost:8000/api'

async function client(
    endpoint,
    { data, formData = false, token, headers: customHeaders, ...customConfig } = {},
) {
    const formDataConfig = {
        method: data ? 'POST' : 'GET',
        body: data ? data : undefined,
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Authorization': token ? `Bearer ${token}` : undefined,
            'x-access-token': token ? token : undefined,
            ...customHeaders,
        },
        ...customConfig,
    }


    const config = {
        method: data ? 'POST' : 'GET',
        body: data ? data : undefined,
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined,
            'x-access-token': token ? token : undefined,
            ...customHeaders,
        },
        ...customConfig,
    }
    return window.fetch(`${apiURL}/${endpoint}`, (data && !formData)?config:formDataConfig).then(async response => {

        if (response.status === 401) {
            console.log("data")

            await auth.logout()
            // refresh the page for them
            window.location.assign(window.location)
            return Promise.reject({ message: 'Please re-authenticate.' })
        }
        if (response.status === 405) {
            return Promise.reject({ message: 'Method not allowed !' })

        }

        const data = await response?.json()
        if (response.ok) {
            return data
        } else {
            return Promise.reject(data)
        }
    })
}


function useClient() {
    const token = auth.getToken();
    return (endpoint, { data, headers: customHeaders, ...customConfig } = {}) =>
        client(endpoint, { data, headers: customHeaders, ...customConfig, token })
}

export { client, useClient }

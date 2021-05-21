const components = {
    scheme: 'http',
    host: 'localhost',
    port: '8080',
}

const baseUrl = `${components.scheme}://${components.host}:${components.port}`
const authUrl = `${baseUrl}/auth`
const usersUrl = `${baseUrl}/users`
const settingsUrl = `${baseUrl}/settings`

function getBasicAuthorizationValue(email, password) {
    return `Basic ${btoa(`${email}:${password}`)}`;
}

function getBearerAuthorizationValue() {
    return `Bearer ${localStorage.token}`;
}

function getBasicHeaders(email, password) {
    return { 'Authorization': getBasicAuthorizationValue(email, password) }
}

function getBearerHeaders() {
    return { 'Authorization': getBearerAuthorizationValue() }
}

function getFormData(body) {
    const formData = new FormData()
    if (body) {
        for (const [key, value] of Object.entries(body)) {
            formData.append(key, value)
        }
    }
    console.log(body)
    return formData
}

function query(queryParams) {
    if (queryParams == null) { return '' }
    let queries = []
    for (const [key, value] of Object.entries(queryParams)) {
        queries.push(`${key}=${value}`)
    }
    return `?${queries.join('&')}`
}

const endpoints = {
    register: {
        name: 'register',
        url: () => { return `${authUrl}/register` },
        method: 'POST',
        body: (body) => { return getFormData(body) }
    },
    login: {
        name: 'login',
        url: () => { return `${authUrl}/login`; },
        method: 'POST',
        headers: (headerParams) => { return getBasicHeaders(headerParams.email, headerParams.password) }
    },
    logout: {
        name: 'logout',
        url: () => { return `${authUrl}/logout` },
        method: 'DELETE',
        headers: () => { return getBearerHeaders() }
    },
    sendEmailVerificationEmail: {
        name: 'sendEmailVerificationEmail',
        url: () => { return `${authUrl}/sendEmailVerificationEmail` },
        method: 'POST',
        headers: (headerParams) => {
            if (headerParams) {
                return getBasicHeaders(headerParams.email, headerParams.password);
            } else {
                return getBearerHeaders();
            }
        },
        body: (body) => { return getFormData(body) }
    },
    verifyEmail: {
        name: 'verifyEmail',
        url: (params) => { return `${authUrl}/verifyEmail/${params.urlParams.tokenId}` },
        method: 'PUT'
    },
    sendPasswordResetEmail: {
        name: 'sendPasswordResetEmail',
        url: () => { return `${authUrl}/sendPasswordResetEmail` },
        method: 'POST',
        body: (body) => { return getFormData(body) }
    },
    resetPassword: {
        name: 'resetPassword',
        url: (params) => { return `${authUrl}/resetPassword/${params.urlParams.tokenId}` },
        method: 'PUT',
        body: (body) => { return getFormData(body) }
    },
    getUser: {
        name: 'getUser',
        url: (params) => {
            if (params.urlParams) { return `${usersUrl}/${params.urlParams.userId}` }
            return `${usersUrl}/me`
        },
        method: 'GET',
        headers: () => { return getBearerHeaders() }
    },
    getUserStatus: {
        name: 'getUserStatus',
        url: (params) => { return `${usersUrl}/status${query(params.queryParams)}` },
        method: 'GET'
    },
    searchUsers: {
        name: 'searchUsers',
        url: (params) => { return `${usersUrl}/search${query(params.queryParams)}` },
        method: 'GET',
        headers: () => { return getBearerHeaders() }
    },
    setAdminStatus: {
        name: 'setAdminStatus',
        url: (params) => { return `${usersUrl}/${params.urlParams.userId}/setAdminStatus` },
        method: 'PUT',
        headers: () => { return getBearerHeaders() }, 
        body: (body) => { return getFormData(body) }
    },
    setFollowingStatus: {
        name: 'setFollowingStatus',
        url: (params) => { return `${usersUrl}/${params.urlParams.userId}/setFollowingStatus` },
        method: 'POST',
        headers: () => { return getBearerHeaders() }, 
        body: (body) => { return getFormData(body) }
    },
    getFollows: {
        name: 'getFollows',
        url: (params) => { return `${usersUrl}/${params.urlParams.userId}/${params.urlParams.followType}` },
        method: 'GET',
        headers: () => { return getBearerHeaders() }
    },
    deleteUser: {
        name: 'deleteUser',
        url: (params) => { return `${usersUrl}/${params.urlParams.userId}` },
        method: 'DELETE',
        headers: () => { return getBearerHeaders() }
    },
    updateUser: {
        name: 'updateUser',
        url: () => { return `${usersUrl}` },
        method: 'PUT',
        headers: () => { return getBearerHeaders() }, 
        body: (body) => { return getFormData(body) }
    },
    uploadProfilePhoto: {
        name: 'uploadProfilePhoto',
        url: () => { return `${usersUrl}/profilePhoto` },
        method: 'POST',
        headers: () => { return getBearerHeaders() },
        body: (body) => { return getFormData(body) }
    },
    getSettings: {
        name: 'getSettings',
        url: () => { return `${settingsUrl}` },
        method: 'GET',
        headers: () => { return getBearerHeaders() }
    }
}

export default {
    components,
    baseUrl,
    endpoints
}
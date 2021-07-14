const baseUrl = process.env.VUE_APP_API_BASE_URL;
const authUrl = `${baseUrl}/auth`
const usersUrl = `${baseUrl}/users`
const settingsUrl = `${baseUrl}/settings`
const postsUrl = `${baseUrl}/posts`

function getBasicAuthorizationValue(email, password) {
    let buffer = Buffer(`${email}:${password}`);
    let base64String = buffer.toString('base64');
    return `Basic ${base64String}`;
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
        method: () => { return 'POST' },
        body: (body) => { return getFormData(body) }
    },
    login: {
        name: 'login',
        url: () => { return `${authUrl}/login`; },
        method: () => { return 'POST' },
        headers: (headerParams) => { return getBasicHeaders(headerParams.email, headerParams.password) }
    },
    logout: {
        name: 'logout',
        url: () => { return `${authUrl}/logout` },
        method: () => { return 'DELETE' },
        headers: () => { return getBearerHeaders() }
    },
    sendEmailVerificationEmail: {
        name: 'sendEmailVerificationEmail',
        url: () => { return `${authUrl}/sendEmailVerificationEmail` },
        method: () => { return 'POST' },
        body: (body) => { return getFormData(body) }
    },
    verifyEmail: {
        name: 'verifyEmail',
        url: (params) => { return `${authUrl}/verifyEmail/${params.urlParams.tokenId}` },
        method: () => { return 'PUT' }
    },
    sendPasswordResetEmail: {
        name: 'sendPasswordResetEmail',
        url: () => { return `${authUrl}/sendPasswordResetEmail` },
        method: () => { return 'POST' },
        body: (body) => { return getFormData(body) }
    },
    resetPassword: {
        name: 'resetPassword',
        url: (params) => { return `${authUrl}/resetPassword/${params.urlParams.tokenId}` },
        method: () => { return 'PUT' },
        body: (body) => { return getFormData(body) }
    },
    getUser: {
        name: 'getUser',
        url: (params) => {
            if (params.urlParams) { return `${usersUrl}/${params.urlParams.userId}` }
            return `${usersUrl}/me`
        },
        method: () => { return 'GET' },
        headers: () => { return getBearerHeaders() }
    },
    getUserStatus: {
        name: 'getUserStatus',
        url: (params) => { return `${usersUrl}/status${query(params.queryParams)}` },
        method: () => { return 'GET' }
    },
    searchUsers: {
        name: 'searchUsers',
        url: (params) => { return `${usersUrl}/search${query(params.queryParams)}` },
        method: () => { return 'GET' },
        headers: () => { return getBearerHeaders() }
    },
    toggleFollowingStatus: {
        name: 'toggleFollowingStatus',
        url: (params) => {
            return `${usersUrl}/${params.urlParams.userId}/${params.urlParams.action}` 
        },
        method: (params) => {
            return (params.urlParams.action === 'follow') ? 'POST' : 'DELETE'
        },
        headers: () => { return getBearerHeaders() }
    },
    getFollows: {
        name: 'getFollows',
        url: (params) => { return `${usersUrl}/${params.urlParams.userId}/${params.urlParams.followType}` },
        method: () => { return 'GET' },
        headers: () => { return getBearerHeaders() }
    },
    deleteUser: {
        name: 'deleteUser',
        url: (params) => { return `${usersUrl}/${params.urlParams.userId}` },
        method: () => { return 'DELETE' },
        headers: () => { return getBearerHeaders() }
    },
    updateUser: {
        name: 'updateUser',
        url: (params) => { 
            if (params.urlParams?.userId) {
                return `${usersUrl}/${params.urlParams.userId}`
            } else {
                return `${usersUrl}`
            }
        },
        method: () => { return 'PUT' },
        headers: () => { return getBearerHeaders() }, 
        body: (body) => { return getFormData(body) }
    },
    uploadProfilePhoto: {
        name: 'uploadProfilePhoto',
        url: () => { return `${usersUrl}/profilePhoto` },
        method: () => { return 'POST' },
        headers: () => { return getBearerHeaders() },
        body: (body) => { return getFormData(body) }
    },
    deleteProfilePhoto: {
        name: 'deleteProfilePhoto',
        url: () => { return `${usersUrl}/profilePhoto` },
        method: () => { return 'DELETE' },
        headers: () => { return getBearerHeaders() }
    },
    getSettings: {
        name: 'getSettings',
        url: () => { return `${settingsUrl}` },
        method: () => { return 'GET' },
        headers: () => { return getBearerHeaders() }
    },
    createPost: {
        name: 'createPost',
        url: () => { return `${postsUrl}` },
        method: () => { return 'POST' },
        headers: () => { return getBearerHeaders() },
        body: (body) => { return getFormData(body) }
    },
    getPosts: {
        name: 'getPosts',
        url: (params) => { 
            if (params.urlParams?.userId) {
                return `${postsUrl}/${params.urlParams.userId}`
            } else {
                return `${postsUrl}`
            }
        },
        method: () => { return 'GET' },
        headers: () => { return getBearerHeaders() }
    },
    getFeed: {
        name: 'getFeed',
        url: () => { return `${postsUrl}/feed` },
        method: () => { return 'GET' },
        headers: () => { return getBearerHeaders() }
    }
}

export default {
    baseUrl,
    endpoints
}
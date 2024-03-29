import api from "./api.js";
import "./../local-storage-helper.js";

function frontendBaseUrl() {
    let loc = window.location;
    return `${loc.protocol}//${loc.hostname}:${loc.port}`;
}

function createError(source, response, data, endpoint) {
    let components = data.reason.split(":");
    let status = response.status;
    let exception = (components.length == 2) ? components[0] : "Unknown"
    let reason = (components.length == 2) ? components[1].trim() : data.reason
    let description = `${endpoint}\n${source}\n${status}\n${exception}\n${reason}`
    if (process.env.NODE_ENV === "development") {
        console.log(description);
    }
    return {
        "endpoint": endpoint,
        "source": source,
        "status": status,
        "exception": exception,
        "reason": reason,
        "description": description
    }
}

function createBasicError(source, error, endpoint) {
    let description = `${endpoint}\n${source}\n${error}`
    if (process.env.NODE_ENV === "development") {
        console.log(description);
    }
    return {
        "endpoint": endpoint,
        "source": source,
        "error": error,
        "description": description
    }
}

function handleAuthenticationResult(data, params) {
    localStorage.login(data);
    params.onSuccess(data)
}

function getUrl(endpoint, params) {
    return endpoint.url({
        urlParams: params.urlParams,
        queryParams: params.queryParams
    })
}

function getRequest(endpoint, params) {
    var headers = endpoint.headers ? endpoint.headers(params.headerParams) : {}
    headers["Device-ID"] = localStorage.deviceId();
    return { 
        method: endpoint.method(params),
        headers: headers,
        body: endpoint.body ? endpoint.body(params.body) : null
    }
}

function makeRequest(endpoint, params) {
    fetch(
        getUrl(endpoint, params),
        getRequest(endpoint, params)
    ).then(response => {
        return response.text().then(text => {
            if (text && text.length) {
                try {
                    const data = JSON.parse(text);
                    handleData(endpoint, response, data, params);
                } catch(error) {
                    params.onFailure(createBasicError("JSON Parsing", error, endpoint.name));
                }
            } else {
                handleResponse(endpoint, response, params);
            }
        })
    }).catch(error => {
        params.onFailure(createBasicError("No Response", error, endpoint.name));
    })
}

function handleResponse(endpoint, response, params) {
    if (response.ok) {
        if (endpoint.name == "logout") { localStorage.clear(); }
        return params.onSuccess();  
    } else {
        return response.json().then(data => {
            handleData(response, data, params)
        }).catch(error => {
            params.onFailure(createBasicError(error, endpoint.name));
        })
    }
}

function handleData(endpoint, response, data, params) {
    if (data.error) {
        if (endpoint.name == "logout" && response.status == 401) {
            localStorage.clear();
            return params.onSuccess();
        } else {
            params.onFailure(createError("handleData", response, data, endpoint.name));
        }
    } else {
        if (["login", "register"].includes(endpoint.name)) {
            handleAuthenticationResult(data, params)
        } else {
            if (endpoint.name == "getUser" && data.id == localStorage.user().id) {
                localStorage.setUser(data);
            }
            params.onSuccess(data);
        }
    }
}

function register(params) {
    makeRequest(api.endpoints.register, params);
}

function login(params) {
    makeRequest(api.endpoints.login, params);
}

function logout(params) {
    makeRequest(api.endpoints.logout, params)
}

function sendEmailVerificationEmail(params) {
    makeRequest(api.endpoints.sendEmailVerificationEmail, params)
}

function verifyEmail(params) {
    makeRequest(api.endpoints.verifyEmail, params)
}

function sendPasswordResetEmail(params) {
    makeRequest(api.endpoints.sendPasswordResetEmail, params)
}

function resetPassword(params) {
    makeRequest(api.endpoints.resetPassword, params)
}

function getUser(params) {
    if (params.urlParams.userId == null) { return }
    makeRequest(api.endpoints.getUser, params)
}

function getUserStatus(params) {
    makeRequest(api.endpoints.getUserStatus, params)
}

function searchUsers(params) {
    makeRequest(api.endpoints.searchUsers, params)
}

function toggleFollowingStatus(params) {
    makeRequest(api.endpoints.toggleFollowingStatus, params)
}

function getFollows(params) {
    makeRequest(api.endpoints.getFollows, params)
}

function getFollowStatus(params) {
    makeRequest(api.endpoints.getFollowStatus, params)
}

function deleteUser(params) {
    makeRequest(api.endpoints.deleteUser, params)
}

function updateUser(params) {
    makeRequest(api.endpoints.updateUser, params)
}

function uploadProfilePhoto(params) {
    makeRequest(api.endpoints.uploadProfilePhoto, params)
}

function deleteProfilePhoto(params) {
    makeRequest(api.endpoints.deleteProfilePhoto, params)
}

function getSettings(params) {
    makeRequest(api.endpoints.getSettings, params)
}

function createPost(params) {
    makeRequest(api.endpoints.createPost, params)
}

function getPosts(params) {
    makeRequest(api.endpoints.getPosts, params)
}

function getFeed(params) {
    makeRequest(api.endpoints.getFeed, params)
}

export default {
    register,
    login,
    logout,
    sendEmailVerificationEmail,
    verifyEmail,
    sendPasswordResetEmail,
    resetPassword,
    getUser,
    getUserStatus,
    searchUsers,
    toggleFollowingStatus,
    getFollows,
    getFollowStatus,
    deleteUser,
    updateUser,
    uploadProfilePhoto,
    deleteProfilePhoto,
    getSettings,
    createPost,
    getPosts,
    getFeed,

    frontendBaseUrl
};
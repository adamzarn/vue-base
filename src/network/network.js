import api from './api.js';

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

Storage.prototype.user = function() {
    return this.getObject('user');
}

function frontendBaseUrl() {
    let loc = window.location;
    return `${loc.protocol}//${loc.hostname}:${loc.port}`;
}

function createError(response, data, endpoint) {
    let components = data.reason.split(':');
    let status = response.status;
    let exception = (components.length == 2) ? components[0] : 'Unknown'
    let reason = (components.length == 2) ? components[1].trim() : data.reason
    let description = `${endpoint}\n${status}\n${exception}\n${reason}`
    return {
        'endpoint': endpoint,
        'status': status,
        'exception': exception,
        'reason': reason,
        'description': description
    }
}

function createBasicError(error, endpoint) {
    return {
        'endpoint': endpoint,
        'description': `${endpoint}\n${error.description}`
    }
}

function handleAuthenticationResult(data, params) {
    localStorage.tokenId = data.id;
    localStorage.token = data.token;
    localStorage.setObject('user', data.user);
    params.onSuccess(data)
}

function getUrl(endpoint, params) {
    return endpoint.url({
        urlParams: params.urlParams,
        queryParams: params.queryParams
    })
}

function getRequest(endpoint, params) {
    return { 
        method: endpoint.method(params),
        headers: endpoint.headers ? endpoint.headers(params.headerParams) : {},
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
                    params.onFailure(createBasicError(error, endpoint.name));
                }
            } else {
                handleResponse(endpoint, response, params);
            }
        })
    }).catch(error => {
        params.onFailure(createBasicError(error, endpoint.name));
    })
}

function handleResponse(endpoint, response, params) {
    if (response.ok) {
        if (endpoint.name == 'logout') { localStorage.clear(); }
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
        if (endpoint.name == 'logout' && response.status == 401) {
            localStorage.clear();
            return params.onSuccess();
        } else {
            params.onFailure(createError(response, data, endpoint.name));
        }
    } else {
        if (['login', 'register'].includes(endpoint.name)) {
            handleAuthenticationResult(data, params)
        } else {
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

function debugDescription(errorObject) {
    return `Endpoint:\n${errorObject.endpoint}\n\nDescription:\n${errorObject.error.description}`;
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
    deleteUser,
    updateUser,
    uploadProfilePhoto,
    deleteProfilePhoto,
    getSettings,

    debugDescription,
    frontendBaseUrl
};
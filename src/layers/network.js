import api from '../constants/api.js';

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
    return window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
}

function getBasicAuthorizationValue(email, password) {
    return "Basic " + btoa(email + ':' + password);
}

function getBearerAuthorizationValue() {
    return "Bearer " + localStorage.token;
}

function getBasicHeaders(email, password) {
    return { 'Authorization': getBasicAuthorizationValue(email, password) }
}

function getBearerHeaders() {
    return { 'Authorization': getBearerAuthorizationValue() }
}

function createError(response, data) {
    let components = data.reason.split(':');
    let status = response.status;
    let identifier = '';
    let reason = '';
    if (components.length == 2) {
        identifier = components[0];
        reason = components[1].trim();
    } else {
        identifier = 'Unknown'
        reason = data.reason
    }
    let description = `${status}\n${identifier}\n${reason}`
    return {
        'status': status,
        'identifier': identifier,
        'reason': reason,
        'description': description
    }
}

function handleAuthenticationResult(params) {
    if (params.data.error) {
        params.onFailure(createError(params.response, params.data));
    } else {
        localStorage.tokenId = params.data.id;
        localStorage.token = params.data.token;
        localStorage.setObject('user', params.data.user);
        params.onSuccess(params.data)
    }
}

function makeRequest(params, url, method, headers, body) {
    fetch(url, { method, headers, body })
    .then(response => {
        return response.text().then(text => {
            if (text && text.length) {
                try {
                    const data = JSON.parse(text);
                    handleData(response, data, params);
                } catch(error) {
                    params.onFailure(error);
                }
            } else {
                handleResponse(response, params);
            }
        })
    }).catch(error => {
        params.onFailure(error)
    })
}


function handleData(response, data, params) {
    if (data.error) {
        params.onFailure(createError(response, data));
    } else {
        params.onSuccess(data);
    }
}

function handleResponse(response, params) {
    if (response.ok) {
        return params.onSuccess();
    } else {
        return response.json().then(data => {
            handleData(response, data, params)
        }).catch(error => {
            params.onFailure(error)
        })
    }
}

function login(params) {
    fetch(api.baseUrl + '/auth/login', {
        method: 'POST',
        headers: getBasicHeaders(params.email, params.password)
    }).then(response => {
        return response.json().then(data => {
            handleAuthenticationResult({
                response,
                data,
                onSuccess: params.onSuccess,
                onFailure: params.onFailure
            })
        }).catch(error => {
            params.onFailure(error)
        })
    }).catch(error => {
        params.onFailure(error)
    })
}

function logout(params) {
    fetch(api.baseUrl + '/auth/logout', {
        method: 'DELETE',
        headers: getBearerHeaders()
    }).then(response => {
        if (response.ok || response.status === 401) {
            localStorage.clear();
            params.onSuccess(response);
        } else {
            params.onFailure(response);
        }
    }).catch(error => {
        params.onFailure(error);
    })
}

function register(params) {
    const formData = new FormData();
    if (params.firstName != '') {
        formData.append("firstName", params.firstName);
    }
    if (params.lastName != '') {
        formData.append("lastName", params.lastName);
    }
    if (params.username != '') {
        formData.append("username", params.username);
    }
    formData.append("lastName", params.lastName);
    formData.append("username", params.username);
    formData.append("email", params.email);
    formData.append("password", params.password);
    formData.append("emailVerificationUrl", frontendBaseUrl() + "/verifyEmail")

    fetch(api.baseUrl + '/auth/register', {
        method: 'POST',
        body: formData
    }).then(response => {
        return response.json();
    }).then(data => {
        handleAuthenticationResult({
            data, 
            onSuccess: params.onSuccess,
            onFailure: params.onFailure
        });
    }).catch(error => {
        params.onFailure(error)
    })
}

function getUser(params) {
    const url = api.baseUrl + '/users/me';
    makeRequest(params, url, 'GET', getBearerHeaders());
}

function getUserStatus(params) {
    const url = api.baseUrl + '/users/status?email=' + params.email;
    makeRequest(params, url, 'GET', {});
}

function getUsers(params) {
    let url = api.baseUrl + '/users/search';
    let queryParameters = [];
    if (params.query != null) {
        queryParameters.push(`query=${params.query}`)
    }
    if (params.start != null) {
        queryParameters.push(`start=${params.start}`)
    }
    if (params.end != null) {
        queryParameters.push(`end=${params.end}`)
    }
    if (params.isAdmin != null) {
        queryParameters.push(`isAdmin=${params.isAdmin}`)
    }
    if (queryParameters.length > 0) {
        url += `?${queryParameters.join('&')}`
    }
    makeRequest(params, url, 'GET', getBearerHeaders());
}

function getFollows(params) {
    const url = api.baseUrl + '/users/' + localStorage.user().id + '/' + params.followsType;
    makeRequest(params, url, 'GET', getBearerHeaders());
}

function getUsersAndFollows(params) {
    if (params.userId == null) { return }
    Promise.all([
        fetch(api.baseUrl + '/users/' + params.userId + '/followers', {
            method: 'GET',
            headers: getBearerHeaders()
        }),
        fetch(api.baseUrl + '/users/' + params.userId + '/following', {
            method: 'GET',
            headers: getBearerHeaders()
        }),
        fetch(api.baseUrl + '/users/search', {
            method: 'GET',
            headers: getBearerHeaders()
        })
    ]).then(responses => {
        return Promise.all(responses.map(response => {
            return response.json();
        }))
    }).then(data => {
        let followerIds = data[0].map(follower => { return follower.id })
        let followingIds = data[1].map(following => { return following.id })
        let users = data[2]
        let updatedUsers = users.map(user => {
            let updatedUser = user;
            updatedUser.you = localStorage.user().id == user.id;
            updatedUser.followingYou = followerIds.includes(user.id);
            updatedUser.following = followingIds.includes(user.id);
            return updatedUser;
        }).sort((user1, user2) => {
            if (user1.lastName < user2.lastName) { return -1 }
            if (user1.lastName > user2.lastName) { return 1 }
            return 0;
        });
        params.onSuccess(updatedUsers);
    }).catch(error => {
        params.onFailure(error);
    })
}

function toggleFollowingStatus(params) {
    const formData = new FormData();
    formData.append("otherUserId", params.otherUser.id);
    formData.append("follow", !params.otherUser.following);

    const url = api.baseUrl + '/users/' + localStorage.user().id + '/setFollowingStatus';
    makeRequest(params, url, 'POST', getBearerHeaders(), formData);
}

function toggleAdminStatus(params) {
    const formData = new FormData();
    formData.append("isAdmin", !params.user.isAdmin);

    const url = api.baseUrl + '/users/' + params.user.id + '/setAdminStatus';
    makeRequest(params, url, 'PUT', getBearerHeaders(), formData);
}

function sendPasswordResetEmail(params) {
    const link = frontendBaseUrl() + "/resetPassword/";
    const formData = new FormData();
    formData.append("email", params.email);
    formData.append("url", link);

    const url = api.baseUrl + '/auth/sendPasswordResetEmail';
    makeRequest(params, url, 'POST', getBearerHeaders(), formData);
}

function resetPassword(params) {
    const formData = new FormData();
    formData.append("value", params.password);

    const url = api.baseUrl + '/auth/resetPassword/' + params.tokenId;
    makeRequest(params, url, 'PUT', {}, formData);
}

function deleteUser(params) {
    const url = api.baseUrl + '/users/' + params.userId;
    makeRequest(params, url, 'DELETE', getBearerHeaders(), new FormData());
}

function updateUser(params) {
    const formData = new FormData();
    if (params.firstName != null) {
        formData.append("firstName", params.firstName);
    }
    if (params.lastName != null) {
        formData.append("lastName", params.lastName);
    }
    if (params.username != null) {
        formData.append("username", params.username);
    }
    if (params.isAdmin != null) {
        formData.append("isAdmin", params.isAdmin);
    }

    const url = api.baseUrl + '/users';
    makeRequest(params, url, 'PUT', getBearerHeaders(), formData);
}

function verifyEmail(params) {
    const url = api.baseUrl + '/users/verifyEmail/' + params.tokenId;
    makeRequest(params, url, 'PUT', {}, new FormData());
}

function sendEmailVerificationEmail(params) {
    const formData = new FormData();
    formData.append("email", "")
    formData.append("password", "")
    formData.append("emailVerificationUrl", frontendBaseUrl() + "/verifyEmail")

    const url = api.baseUrl + '/auth/sendEmailVerificationEmail';
    makeRequest(params, url, 'POST', getBasicHeaders(params.email, params.password), formData);
}

export default { login, logout, register, getUser, getUserStatus, getUsers, getFollows, getUsersAndFollows, toggleFollowingStatus, toggleAdminStatus, sendPasswordResetEmail, resetPassword, deleteUser, updateUser, verifyEmail, sendEmailVerificationEmail };
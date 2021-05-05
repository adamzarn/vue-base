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

function handleAuthenticationResult(params) {
    if (params.data.error) {
        params.onFailure(params.data.reason);
    } else {
        localStorage.tokenId = params.data.id;
        localStorage.token = params.data.token;
        localStorage.setObject('user', params.data.user);
        params.onSuccess(params.data)
    }
}

function handleData(data, params) {
    if (data.error) {
        params.onFailure(data.reason);
    } else {
        params.onSuccess(data);
    }
}

function handleResponse(response, params) {
    if (response.ok) {
        return params.onSuccess();
    } else {
        return response.json().then(data => {
            handleData(data, params)
        }).catch(error => {
            params.onFailure(error)
        })
    }
}

function makeDataRequest(params, url, method, headers) {
    fetch(url, { method, headers })
    .then(response => {
        return response.json();
    }).then(data => {
        handleData(data, params);
    }).catch(error => {
        params.onFailure(error)
    })
}

function makeResponseRequest(params, url, method, headers, body) {
    fetch(url, { method, headers, body })
    .then(response => {
        handleResponse(response, params)
    })
}

function login(params) {
    fetch(api.baseUrl + '/auth/login', {
        method: 'POST',
        headers: getBasicHeaders(params.email, params.password)
    }).then(response => {
        return response.json();
    }).then(data => {
        handleAuthenticationResult({
            data,
            onSuccess: params.onSuccess,
            onFailure: params.onFailure
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

function getUserStatus(params) {
    const url = api.baseUrl + '/users/status?email=' + params.email;
    makeDataRequest(params, url, 'GET', {}, handleData);
}

function getUsers(params) {
    const url = api.baseUrl + '/users';
    makeDataRequest(params, url, 'GET', getBearerHeaders(), handleData);
}

function getFollows(params) {
    const url = api.baseUrl + '/users/' + localStorage.user().id + '/' + params.followsType;
    makeDataRequest(params, url, 'GET', getBearerHeaders(), handleData);
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
        fetch(api.baseUrl + '/users', {
            method: 'GET',
            headers: getBearerHeaders()
        })
    ]).then(responses => {
        return Promise.all(responses.map(response => {
            return response.json();
        }))
    }).then(data => {
        var followerIds = data[0].map(follower => { return follower.id })
        var followingIds = data[1].map(following => { return following.id })
        var users = data[2]
        var updatedUsers = users.map(user => {
            var updatedUser = user;
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
    makeResponseRequest(params, url, 'POST', getBearerHeaders(), formData);
}

function toggleAdminStatus(params) {
    const formData = new FormData();
    formData.append("isAdmin", !params.user.isAdmin);

    const url = api.baseUrl + '/users/' + params.user.id + '/setAdminStatus';
    makeResponseRequest(params, url, 'PUT', getBearerHeaders(), formData);
}

function sendPasswordResetEmail(params) {
    const link = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/resetPassword/";
    const formData = new FormData();
    formData.append("email", params.email);
    formData.append("url", link);

    const url = api.baseUrl + '/auth/sendPasswordResetEmail';
    makeResponseRequest(params, url, 'POST', getBearerHeaders(), formData);
}

function resetPassword(params) {
    const formData = new FormData();
    formData.append("value", params.password);

    const url = api.baseUrl + '/auth/resetPassword/' + params.tokenId;
    makeResponseRequest(params, url, 'PUT', {}, formData);
}

function deleteUser(params) {
    const url = api.baseUrl + '/users/' + params.userId;
    makeResponseRequest(params, url, 'DELETE', {}, new FormData());
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
    makeResponseRequest(params, url, 'PUT', getBearerHeaders(), formData);
}

export default { login, logout, register, getUserStatus, getUsers, getFollows, getUsersAndFollows, toggleFollowingStatus, toggleAdminStatus, sendPasswordResetEmail, resetPassword, deleteUser, updateUser };
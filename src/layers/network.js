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

function login(params) {
    fetch(api.baseUrl + '/auth/login', {
    method: 'POST',
    headers: getBasicHeaders(params.email, params.password),
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
    formData.append("firstName", params.firstName);
    formData.append("lastName", params.lastName);
    formData.append("email", params.email);
    formData.append("password", params.password);

    fetch(api.baseUrl + '/auth/register', {
        method: 'POST',
        body: formData
    }).then(response => {
        return response.json();
    }).then(data => {
        handleAuthenticationResult(data, params.onSuccess, params.onFailure)
    }).catch(error => {
        params.onFailure(error)
    })
}

function getUserStatus(params) {
    fetch(api.baseUrl + '/users/status?email=' + params.email, {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.error) {
            params.onFailure(data.reason);
        } else {
            params.onSuccess(data);
        }
    }).catch(error => {
        params.onFailure(error)
    })
}

function getUsers(params) {
    fetch(api.baseUrl + '/users', {
        method: 'GET',
        headers: getBearerHeaders()
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.error) {
            params.onFailure(data.reason);
        } else {
            params.onSuccess(data);
        }
    }).catch(error => {
        params.onFailure(error)
    })
}

function getFollows(params) {
    fetch(api.baseUrl + '/users/' + localStorage.user().id + '/' + params.followsType, {
        method: 'GET',
        headers: getBearerHeaders()
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.error) {
            params.onFailure(data.reason);
        } else {
            params.onSuccess(data);
        }
    }).catch(error => {
        params.onFailure(error)
    })
}

function getUsersAndFollows(params) {
    Promise.all([
        fetch(api.baseUrl + '/users/' + localStorage.user().id + '/followers', {
            method: 'GET',
            headers: getBearerHeaders()
        }),
        fetch(api.baseUrl + '/users/' + localStorage.user().id + '/following', {
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

    fetch(api.baseUrl + '/users/' + localStorage.user().id + '/setFollowingStatus', {
        method: 'POST',
        headers: getBearerHeaders(),
        body: formData
    }).then(response => {
        if (response.ok) {
            return params.onSuccess();
        } else {
            return response.json().then(data => {
                if (data.error) {
                    params.onFailure(data.reason);
                } else {
                    params.onSuccess(data);
                }
            }).catch(error => {
                params.onFailure(error)
            })
        }
    })
}

function toggleAdminStatus(params) {
    const formData = new FormData();
    formData.append("isAdmin", !params.user.isAdmin);

    fetch(api.baseUrl + '/users/' + params.user.id + '/setAdminStatus', {
        method: 'PUT',
        headers: getBearerHeaders(),
        body: formData
    }).then(response => {
        if (response.ok) {
            return params.onSuccess();
        } else {
            return response.json().then(data => {
                if (data.error) {
                    params.onFailure(data.reason);
                } else {
                    params.onSuccess(data);
                }
            }).catch(error => {
                params.onFailure(error)
            })
        }
    })
}

function sendPasswordResetEmail(params) {
    const url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/resetPassword/";
    const formData = new FormData();
    formData.append("email", params.email);
    formData.append("url", url);

    fetch(api.baseUrl + '/auth/sendPasswordResetEmail', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            return params.onSuccess();
        } else {
            return response.json().then(data => {
                if (data.error) {
                    params.onFailure(data.reason);
                } else {
                    params.onSuccess();
                }
            }).catch(error => {
                params.onFailure(error)
            })
        }
    })
}

function resetPassword(params) {
    const formData = new FormData();
    formData.append("value", params.password);

    fetch(api.baseUrl + '/auth/resetPassword/' + params.tokenId, {
        method: 'PUT',
        body: formData
    }).then(response => {
        if (response.ok) {
            return params.onSuccess();
        } else {
            return response.json().then(data => {
                if (data.error) {
                    params.onFailure(data.reason);
                } else {
                    params.onSuccess();
                }
            }).catch(error => {
                params.onFailure(error)
            })
        }
    })
}

export default { login, logout, register, getUserStatus, getUsers, getFollows, getUsersAndFollows, toggleFollowingStatus, toggleAdminStatus, sendPasswordResetEmail, resetPassword };
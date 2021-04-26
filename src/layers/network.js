import api from '../constants/api.js';

function getBasicAuthorizationValue(email, password) {
    return "Basic " + btoa(email + ':' + password);
}

function getBearerAuthorizationValue() {
    return "Bearer " + localStorage.token;
}

function handleAuthenticationResult(params) {
    if (params.data.error) {
        params.onFailure(params.data.reason);
    } else {
        localStorage.token = params.data.token;
        localStorage.firstName = params.data.user.firstName;
        localStorage.lastName = params.data.user.lastName;
        params.onSuccess(params.data)
    }
}

function login(params) {
    console.log(params);
    fetch(api.baseUrl + '/auth/login', {
    method: 'POST',
    headers: {
        'Authorization': getBasicAuthorizationValue(params.email, params.password)
    }
    }).then(response => {
        console.log(response)
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
        headers: {
            'Authorization': getBearerAuthorizationValue()
        }
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
        headers: {
            'Authorization': getBearerAuthorizationValue()
        }
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            params.onFailure("There was a problem retrieving the list of users")
        }
    }).then(users => {
        params.onSuccess(users)
    }).catch(error => {
        params.onFailure(error)
    })
}

export default { login, logout, register, getUserStatus, getUsers };
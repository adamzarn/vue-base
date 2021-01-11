import api from '../constants/api.js';

function getBasicAuthorizationValue(email, password) {
    return "Basic " + btoa(email + ':' + password);
}

function getBearerAuthorizationValue() {
    return "Bearer " + localStorage.token;
}

function handleAuthenticationResult(data, onSuccess, onFailure) {
    if (data.error) {
        onFailure(data.reason);
    } else {
        localStorage.token = data.token;
        localStorage.firstName = data.user.firstName;
        localStorage.lastName = data.user.lastName;
        onSuccess(data)
    }
}

function login(email, password, onSuccess, onFailure) {
    fetch(api.baseUrl + '/auth/login', {
    method: 'POST',
    headers: {
        'Authorization': getBasicAuthorizationValue(email, password)
    }
    }).then(response => {
        return response.json();
    }).then(data => {
        handleAuthenticationResult(data, onSuccess, onFailure)
    }).catch(error => {
        onFailure(error)
    })
}

function logout(onSuccess, onFailure) {
    fetch(api.baseUrl + '/auth/logout', {
        method: 'DELETE',
        headers: {
            'Authorization': getBearerAuthorizationValue()
        }
    }).then(response => {
        if (response.ok || response.status === 401) {
            localStorage.clear();
            onSuccess(response);
        } else {
            onFailure(response);
        }
    }).catch(error => {
        onFailure(error);
    })
}

function register(firstName, lastName, email, password, onSuccess, onFailure) {

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);

    fetch(api.baseUrl + '/auth/register', {
        method: 'POST',
        body: formData
    }).then(response => {
        return response.json();
    }).then(data => {
        handleAuthenticationResult(data, onSuccess, onFailure)
    }).catch(error => {
        onFailure(error)
    })
}

function getUserStatus(email, onSuccess, onFailure) {
    fetch(api.baseUrl + '/users/status?email=' + email, {
        method: 'GET',
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.error) {
            onFailure(data.reason);
        } else {
            onSuccess(data);
        }
    }).catch(error => {
        onFailure(error)
    })
}

function getUsers(onSuccess, onFailure) {
    fetch(api.baseUrl + '/users', {
        method: 'GET',
        headers: {
            'Authorization': getBearerAuthorizationValue()
        }
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            onFailure("There was a problem retrieving the list of users")
        }
    }).then(users => {
        onSuccess(users)
    }).catch(error => {
        onFailure(error)
    })
}

export default { login, logout, register, getUserStatus, getUsers };
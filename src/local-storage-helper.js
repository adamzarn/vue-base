Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

Storage.prototype.user = function() {
    return this.getObject("user");
}

Storage.prototype.setUser = function(data) {
    this.setObject("user", data);
}

Storage.prototype.login = function(data) {
    this.tokenId = data.id;
    this.token = data.token;
    this.emailVerificationIsRequired = data.emailVerificationIsRequired;
    this.setUser(data.user);
}

Storage.prototype.isLoggedIn = function() {
    return this.token != null;
}
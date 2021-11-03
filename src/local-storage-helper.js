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

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

Storage.prototype.deviceId = function() {
    if (this.getItem("Device-ID") == null) {
        let deviceId = uuidv4();
        this.setItem("Device-ID", deviceId);
        return deviceId;
    } else {
        return this.getItem("Device-ID");
    }
}
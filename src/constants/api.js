const components = {
    scheme: 'http',
    host: 'localhost',
    port: '8080',
}

const baseUrl = components.scheme + '://' + components.host + ':' + components.port

export default {
    components,
    baseUrl
}
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { HOST } from '../api';

const cache = new InMemoryCache();

const defaultOptions = {
    // You can use `wss` for secure connection (recommended in production)
    // Use `null` to disable subscriptions
    wsEndpoint: null,
    // LocalStorage token
    credentials: 'include',
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false,
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false,
    // Is being rendered on the server?
    ssr: false,
}

const clientQueryOptions = {
    uri: HOST + '/api/query/graphql', 
    cache
}

const clientGatewayOptions = {
    uri: HOST + '/api/gateway/graphql',
    cache
}

const queryClient = new ApolloClient({
    ...defaultOptions,
    ...clientQueryOptions,
});

const gatewayClient = new ApolloClient({
    ...defaultOptions,
    ...clientGatewayOptions,
});



export { queryClient, gatewayClient }
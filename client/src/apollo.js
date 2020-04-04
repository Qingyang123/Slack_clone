import { ApolloClient } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';


// Create an http link:
const httpLink = createHttpLink({
	uri: "http://localhost:4000/graphql"
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
        reconnect: true
    }
});

const authLink = setContext(() => ({
	headers: {
		'x-token': localStorage.getItem('token'),
		'x-refresh-token': localStorage.getItem('refreshToken')
	}
}))

const afterAuthLink = new ApolloLink((operation, forward) => 
	forward(operation).map((response) => {
		const { response: { headers } } = operation.getContext();
		if (headers) {
			const token = headers.get('x-token');
			const refreshToken = headers.get('x-refresh-token');

			if (token) {
				localStorage.setItem('token', token);
			}

			if (refreshToken) {
				localStorage.setItem('refreshToken', refreshToken);
			}
		}

		return response;
	})
);

const httpLinkWithMiddleware = afterAuthLink.concat(authLink.concat(httpLink));


const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLinkWithMiddleware,
);


export default new ApolloClient({
	link,
	cache: new InMemoryCache()
})
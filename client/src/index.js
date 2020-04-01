import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'

import Routes from './routes';


const httpLink = createHttpLink({
	uri: "http://localhost:4000/graphql"
})

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

const client = new ApolloClient({
	link: httpLinkWithMiddleware,
	cache: new InMemoryCache()
})
const App = (
	<ApolloProvider client={client}>
		<Routes/>
	</ApolloProvider>
)

ReactDOM.render(App, document.getElementById('root'));
serviceWorker.unregister();

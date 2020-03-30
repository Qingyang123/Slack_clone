import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'

import Routes from './routes';


const client = new ApolloClient({
	link: new HttpLink({
		uri: "http://localhost:4000/graphql"
	}),
	cache: new InMemoryCache()
})
const App = (
	<ApolloProvider client={client}>
		<Routes/>
	</ApolloProvider>
)

ReactDOM.render(App, document.getElementById('root'));
serviceWorker.unregister();

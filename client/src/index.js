import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'

import Routes from './routes';
import client from './apollo';


const App = (
	<ApolloProvider client={client}>
		<Routes/>
	</ApolloProvider>
)

ReactDOM.render(App, document.getElementById('root'));
serviceWorker.unregister();

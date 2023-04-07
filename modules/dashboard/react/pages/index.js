import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

import Headers from '../component/header';
import Background from '../component/background';
import Sidebar from '../component/sidebar';

const client = new ApolloClient({
    uri: `http://localhost:5050/api`,
    cache: new InMemoryCache(),
});

const App = () => {
    return (
        <ApolloProvider client={client}>
            <div className='app' style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
            }}>
                <Headers></Headers>
                <Background />

                <Sidebar></Sidebar>
            </div>
        </ApolloProvider>
    );
};

export default App;

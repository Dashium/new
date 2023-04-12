import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

import Headers from '../component/header';
import Background from '../component/background';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';

import Login from '../component/login';

import Monitor from '../component/monitor';
import TerminalSSH from '../component/terminal';

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
                height: '100%',
                overflow: 'hidden',

                userSelect: 'none',
                MozUserSelect: 'none',
                WebkitUserSelect: 'none'
            }}>
                <Headers></Headers>
                <Background />

                <Login></Login>

                {/* <Sidebar></Sidebar> */}

                <div style={{
                    position: 'relative',
                    top: '2%',
                    left: '2%',
                    right: '2%',
                    width: '100%'
                }}>
                    <Monitor containerName={'o7vZWjYh31'}></Monitor>
                    <TerminalSSH containerName={'o7vZWjYh31'}></TerminalSSH>
                </div>

                <Navbar></Navbar>

            </div>
        </ApolloProvider>
    );
};

export default App;

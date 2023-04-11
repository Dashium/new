import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

import Headers from '../component/header';
import Background from '../component/background';
import Sidebar from '../component/sidebar';

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
                // color: 'white'
            }}>
                <Headers></Headers>
                <Background />

                {/* <Sidebar></Sidebar> */}

                <div style={{
                    position: 'absolute',
                    top: '2%',
                    right: '2%',
                    width: 'calc(100% - 240px - 4%)'
                }}>
                    <Monitor containerName={'test9'}></Monitor>
                    <TerminalSSH containerName={'test9'}></TerminalSSH>
                </div>

            </div>
        </ApolloProvider>
    );
};

export default App;

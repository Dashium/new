import React from 'react';

import Headers from '../component/header';
import Background from '../component/background';

import Dashboard from '../component/dashboard';

const App = () => {
    return (
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
            <Headers title='Dashboard'></Headers>
            <Background mode='color' />
            <Dashboard></Dashboard>
        </div>
    );
};

export default App;

import React from 'react';
const config = require('../../../config/global.json');

import Headers from '../component/header';
import Background from '../component/background';

import Login from '../component/login';

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
            <Headers></Headers>
            <Background mode='color' />
            <Login api={config.api}></Login>
        </div>
    );
};

export default App;

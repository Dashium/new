import React from 'react';

const Background = () => {
    return (
        <div style={{
            position: 'fixed',
            zIndex: -1,
            background: 'linear-gradient(100deg, #0e044b, #6901df)',
            height: '100vh',
            width: '100%'
        }} />
    );
};

export default Background;

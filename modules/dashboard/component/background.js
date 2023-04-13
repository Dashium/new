/* eslint-disable @next/next/no-img-element */
import React from 'react';

const Background = ({mode}) => {
    if(mode == 'img'){
        mode = `<img src='./themes/desktop/0.png' alt='Background' />`;
    }
    else{
        mode = '';
    }
    return (
        <div style={{
            position: 'fixed',
            zIndex: -1,
            background: 'linear-gradient(100deg, #0e044b, #6901df)',
            height: '100vh',
            width: '100%'
        }}>
            {mode}
        </div>
    );
};

export default Background;

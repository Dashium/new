/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
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

/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

import React, { useState } from 'react';

const Popup = ({ type, message, close, button }) => {
    const [display, setDisplay] = useState(true);

    const handleOnClick = () => {
        setDisplay(false);
        if (typeof close === 'function') {
            close();
        }
    };

    const getClassName = () => {
        switch (type) {
            case 'success':
                return 'popup-success';
            case 'warning':
                return 'popup-warning';
            case 'error':
                return 'popup-error';
            default:
                return 'popup-default';
        }
    };

    return (
        <div className={`popup ${display ? 'show' : 'hide'}`}>
            <div style={{ display: 'flex' }}className={getClassName()}>
                <div className="popup-message">{message}</div>
                {button ? (
                    <button className="popup-button" onClick={handleOnClick}>
                        {button}
                    </button>
                ) : (
                    <div className="popup-close" onClick={handleOnClick}>
                        X
                    </div>
                )}
            </div>
        </div>
    );
};

export default Popup;

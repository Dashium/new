import React, { useState } from 'react';

const Popup = ({ type, message, close }) => {
    const [display, setDisplay] = useState(true);

    const handleOnClick = () => {
        setDisplay(false);
        close();
    }

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
    }

    return (
        <div className={`popup ${display ? 'show' : 'hide'}`}>
            <div className={getClassName()}>
                <div className="popup-message">{message}</div>
                <div className="popup-close" onClick={handleOnClick}>X</div>
            </div>
        </div>
    );
};

export default Popup;

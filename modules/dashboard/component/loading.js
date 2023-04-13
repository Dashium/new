import React from 'react';

const Loading = ({ text }) => {
    return (
        <div className="loading-container">
            <h1>{text}</h1>
            <div className="loading"></div>
        </div>
    );
};

export default Loading;

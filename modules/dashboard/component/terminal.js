import React from "react";
var config = require('../../../config/global.json');

const TerminalSSH = ({ containerName }) => {
    return (
        <div className="terminal-container">
            <div className="terminal-header">
                <div className="terminal-buttons">
                    <div className="terminal-dot terminal-red"></div>
                    <div className="terminal-dot terminal-yellow"></div>
                    <div className="terminal-dot terminal-green"></div>
                </div>
                <div className="terminal-title">SSH Terminal</div>
            </div>
            <div className="terminal-body">
                <iframe src={`http://${config.ssh.host}:${config.ssh.port}/${containerName}`}></iframe>
            </div>
        </div>
    );
};

export default TerminalSSH;

/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

import React from "react";

const TerminalSSH = ({ config, containerName }) => {
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
                <iframe src={`https://${config.ssh.host}:${config.ssh.port}/${containerName}`}></iframe>
            </div>
        </div>
    );
};

export default TerminalSSH;

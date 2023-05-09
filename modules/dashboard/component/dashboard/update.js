/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../popup';

const DashiumUpdater = ({ config, repoName }) => {
    const [isUpToDate, setIsUpToDate] = useState(true);
    const [latestCommitSha, setLatestCommitSha] = useState(null);
    const [currentCommitSha, setcurrentCommitSha] = useState(null);

    useEffect(() => {
        const fetchLatestCommitSha = async () => {
            const response = await fetch(`https://api.github.com/repos/${repoName}/commits/main`);
            const latestCommit = await response.json();
            setLatestCommitSha(latestCommit.sha);
        };
        const fetchGlobalData = async () => {
            const response = await (await axios.get(`https://${config.api.host}:${config.api.port}/global`)).data[0];
            const data = response['json'];
            const currentCommitSha = data.update;
            setcurrentCommitSha(currentCommitSha);
            if (currentCommitSha !== latestCommitSha) {
                setIsUpToDate(false);
            }
            if (currentCommitSha === latestCommitSha) {
                setIsUpToDate(true);
            }
        };

        fetchLatestCommitSha();
        fetchGlobalData();
    }, [repoName, config, currentCommitSha, latestCommitSha]);

    const handleUpdateClick = () => {
        axios.post(`https://${config.api.host}:${config.api.port}/update`);
        setTimeout(() => {
            window.location.reload();
        }, 300000);
    };

    return (
        <div>
            {isUpToDate == false && (
                <Popup close={handleUpdateClick} type='warning' button='Update' message={`A new version of the application is available!`}></Popup>
            )}
        </div>
    );
};

export default DashiumUpdater;

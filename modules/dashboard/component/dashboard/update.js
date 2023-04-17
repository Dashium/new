import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../popup';

const DashiumUpdater = ({ config, repoName }) => {
    const [isUpToDate, setIsUpToDate] = useState(true);
    const [latestCommitSha, setLatestCommitSha] = useState(null);

    useEffect(() => {
        const fetchLatestCommitSha = async () => {
            const response = await fetch(`https://api.github.com/repos/${repoName}/commits/main`);
            const latestCommit = await response.json();
            setLatestCommitSha(latestCommit.sha);
        };

        fetchLatestCommitSha();
    }, [repoName]);

    useEffect(() => {
        const fetchGlobalData = async () => {
            const response = await (await axios.get(`http://${config.api.host}:${config.api.port}/global`)).data[0];
            const data = response['json'];
            const currentCommitSha = data.update.sha;
            if (currentCommitSha !== latestCommitSha) {
                setIsUpToDate(false);
            }
        };

        if (latestCommitSha != null) {
            fetchGlobalData();
        }
    }, [config, latestCommitSha]);

    const handleUpdateClick = () => {
        axios.get(`http://${config.api.host}:${config.api.port}/update`);
        setTimeout(() => {
            window.location.reload();
        }, 300000);
    };

    return (
        <div>
            {!isUpToDate && (
                <Popup close={handleUpdateClick} type='warning' button='Update' message='A new version of the application is available!'></Popup>
            )}
        </div>
    );
};

export default DashiumUpdater;

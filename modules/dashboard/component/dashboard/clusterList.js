/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClusterList = ({ config, setclusterId, setcluster }) => {
    const [clusters, setclusters] = useState([]);

    useEffect(() => {
        axios.get(`https://${config.api.host}:${config.api.port}/clusters`)
            .then(response => setclusters(response.data))
            .catch(error => console.log(error));
    }, [config]);

    return (
        <div className="cluster-container">
            <h1>Liste des clusters</h1>
            <div className="cluster-list">
                {clusters.map((cluster) => (
                    <div className="cluster-card" key={cluster.id}>
                        <div className="cluster-details">
                            <h2>{cluster.name}</h2>
                            <div className='ports'>
                                <a key={cluster.id} target='_blank' href={`${cluster.path}`}>{`${cluster.path}`}</a>
                            </div>
                            {/* <a href={`/cluster/${cluster.id}`} rel="noopener noreferrer">Voir le projet</a> */}
                            <button onClick={() => {
                                setclusterId(cluster);
                                setcluster(true);
                            }}>Voir le cluster</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClusterList;

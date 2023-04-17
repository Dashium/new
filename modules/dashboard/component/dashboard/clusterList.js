import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClusterList = ({ config, setclusterId, setcluster }) => {
    const [clusters, setclusters] = useState([]);

    useEffect(() => {
        axios.get(`http://${config.api.host}:${config.api.port}/clusters`)
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
                            }}>Voir le projet</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClusterList;

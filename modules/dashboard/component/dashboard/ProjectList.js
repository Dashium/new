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

const ProjectList = ({ config, setProjectId, setProject, setMenu, setMode }) => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios.get(`https://${config.api.host}:${config.api.port}/projects`)
            .then(response => setProjects(response.data))
            .catch(error => console.log(error));
    }, [config]);

    return (
        <div className="project-container">
            <div className="project-header">
                <h1>Liste des projets</h1>
                <button onClick={() => {
                    setMenu('addproject');
                }}>Ajouter un projet</button>
            </div>
            <div className="project-list">
                {projects.map((project) => (
                    <div className="project-card" key={project.id}>
                        <div className="project-details">
                            <h2>{project.name}</h2>
                            <div className='ports'>
                                {
                                    project.docker.ports && project.docker.ports.map((val, id) => {
                                        return (
                                            <a key={id} target='_blank' href={`http://${config.server.host}:${val.host}/`}>{`http://${config.server.host}:${val.host}/`}</a>
                                        )
                                    })
                                }
                            </div>
                            {/* <a href={`/project/${project.id}`} rel="noopener noreferrer">Voir le projet</a> */}
                            <button onClick={() => {
                                setProjectId(project);
                                setProject(true);
                                setMode('');
                            }}>Voir le projet</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectList = ({ config, setProjectId, setProject }) => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios.get(`http://${config.api.host}:${config.api.port}/projects`)
            .then(response => setProjects(response.data))
            .catch(error => console.log(error));
    }, [config]);

    return (
        <div className="project-container">
            <h1>Liste des projets</h1>
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
                            }}>Voir le projet</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;

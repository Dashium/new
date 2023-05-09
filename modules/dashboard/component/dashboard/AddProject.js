/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

import { useEffect, useState } from 'react';
import axios from 'axios';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiPlus } from 'react-icons/bi';

const AddProjectForm = ({ config, setMenu }) => {
    const [projectName, setProjectName] = useState('');
    const [clusters, setClusters] = useState([]);
    const [cluster, setCluster] = useState('');
    const [service, setService] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [commands, setCommands] = useState('');
    const [ports, setPorts] = useState([]);
    const [envVars, setEnvVars] = useState([]);

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // fetch projects data from API when service changes
        async function fetchProjects() {
            try {
                const response = await axios.post(`https://${config.api.host}:${config.api.port}/get_repos/`, { service: service })
                const data = response.data;
                setProjects(data);
            } catch (error) {
                console.error(error);
            }
        }

        if (service !== "") {
            fetchProjects();
        }

        axios.get(`https://${config.api.host}:${config.api.port}/clusters`).then(response => {
            setClusters(response.data);
        });
    }, [config, service]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            projectName,
            cluster,
            service,
            selectedProject,
            selectedImage,
            selectedLanguage,
            commands,
            ports,
            envVars,
        };
        axios.post(`https://${config.api.host}:${config.api.port}/add_project`, data);
        setMenu('dashboard');
    }

    const handleAddPort = () => {
        setPorts((prevPorts) => [...prevPorts, { port: '' }]);
    };

    const handleRemovePort = (index) => {
        setPorts((prevPorts) => [...prevPorts.slice(0, index), ...prevPorts.slice(index + 1)]);
    };

    const handleAddEnvVar = () => {
        setEnvVars((prevEnvVars) => [...prevEnvVars, { name: '', value: '' }]);
    };

    const handleRemoveEnvVar = (index) => {
        setEnvVars((prevEnvVars) => [...prevEnvVars.slice(0, index), ...prevEnvVars.slice(index + 1)]);
    };

    return (
        <div className='addProjectForm'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="projectName">*Nom du projet :</label>
                    <input
                        type="text"
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <div>
                        <label htmlFor="cluster">Cluster :</label>
                        <select id="cluster" value={cluster} onChange={(e) => setCluster(e.target.value)}>
                            <option value="" hidden>-- Choisissez un cluster --</option>
                            {clusters.map(cluster => (
                                <option key={cluster.id} value={cluster.id}>
                                    {cluster.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="service">Service :</label>
                    <select id="service" value={service} onChange={(e) => setService(e.target.value)}>
                        <option value="">-- Choisissez un service --</option>
                        <option value="github">GitHub</option>
                        <option value="gitlab">GitLab</option>
                        <option value="bitbucket">Bitbucket</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="selectedProject">Projet :</label>
                    {service === 'github' && (
                        <select
                            id="selectedProject"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <option value="" hidden>-- Choisissez un projet --</option>
                            {projects.map((project) => (
                                <option key={project.repository.id} value={project.repository.html_url}>
                                    {project.repository.name}
                                </option>
                            ))}
                        </select>
                    )}
                    {service === 'gitlab' && (
                        <select
                            id="selectedProject"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <option value="" hidden>-- Choisissez un projet --</option>
                            {projects.map((project) => (
                                <option key={project.repository.id} value={project.repository.html_url}>
                                    {project.repository.name}
                                </option>
                            ))}
                        </select>
                    )}
                    {service === 'bitbucket' && (
                        <select
                            id="selectedProject"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <option value="" hidden>-- Choisissez un projet --</option>
                            {projects.map((project) => (
                                <option key={project.repository.id} value={project.repository.html_url}>
                                    {project.repository.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div>
                    <label htmlFor="selectedImage">Image système :</label>
                    <select id="selectedImage" value={selectedImage} onChange={(e) => setSelectedImage(e.target.value)}>
                        <option value="">-- Choisissez une image --</option>
                        <option value="ubuntu:latest">Ubuntu</option>
                        <option value="arch">Arch Linux</option>
                        <option value="debian">Debian</option>
                        <option value="windows">Windows</option>
                        <option value="macos">macOS</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="selectedLanguage">Langage :</label>
                    <select
                        id="selectedLanguage"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                        <option value="">-- Choisissez un langage --</option>
                        <option value="nodejs">Node.js</option>
                        <option value="python">Python</option>
                        <option value="go">Go</option>
                        <option value="php">PHP</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="commands">Commandes à exécuter :</label>
                    <textarea
                        id="commands"
                        value={commands}
                        onChange={(e) => setCommands(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <h3>Ports :</h3>
                    {ports.map((port, index) => (
                        <div key={index}>
                            <input
                                type="number"
                                placeholder="Port"
                                value={port.port}
                                onChange={(e) => {
                                    const newPorts = [...ports];
                                    newPorts[index].port = e.target.value;
                                    setPorts(newPorts);
                                }}
                            />
                            <button type="button" className='delete' onClick={() => handleRemovePort(index)}>
                                <RiDeleteBin6Line />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddPort}>
                        <BiPlus />Ajouter un port
                    </button>
                </div>
                <div>
                    <h3>Variables d'environnement :</h3>
                    {envVars.map((envVar, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Nom de la variable"
                                value={envVar.name}
                                onChange={(e) => {
                                    const newEnvVars = [...envVars];
                                    newEnvVars[index].name = e.target.value;
                                    setEnvVars(newEnvVars);
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Valeur de la variable"
                                value={envVar.value}
                                onChange={(e) => {
                                    const newEnvVars = [...envVars];
                                    newEnvVars[index].value = e.target.value;
                                    setEnvVars(newEnvVars);
                                }}
                            />
                            <button type="button" className='delete' onClick={() => handleRemoveEnvVar(index)}>
                                <RiDeleteBin6Line />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddEnvVar}>
                        <BiPlus /> Ajouter une variable d'environnement
                    </button>
                </div>
                <button type="submit"><BiPlus />Créer le projet</button>
                <button type='reset' onClick={() => { setMenu('dashboard'); }}>Annuler</button>
            </form>
        </div>
    );
};

export default AddProjectForm;

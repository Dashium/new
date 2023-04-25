import { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaLock } from 'react-icons/fa';
import axios from 'axios';
import TerminalSSH from './terminal';
import Monitor from './monitor';

function ProjectManager({ config, projectId, setProjectId, setMode }) {
    const [project, setProject] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState('general');
    const [newPort, setNewPort] = useState('');
    const [newScript, setNewScript] = useState('');

    useEffect(() => {
        axios.get(`http://${config.api.host}:${config.api.port}/projects/${projectId}`)
            .then(response => {
                setProject(response.data);
                setLoading(false);
            })
            .catch(error => console.log(error));
    }, [config, projectId]);

    const handleMenuClick = (menu) => {
        if(menu == 'return'){
            setProjectId(null);
            setMode('project');
        }
        setActiveMenu(menu);
    };

    const handlePortAdd = () => {
        setProject({
            ...project,
            ports: [...project.docker.ports, newPort]
        });
        setNewPort('');
    };

    const handlePortDelete = (index) => {
        const updatedPorts = [...project.docker.ports];
        updatedPorts.splice(index, 1);
        setProject({
            ...project,
            ports: updatedPorts
        });
    };

    const handleScriptAdd = () => {
        setProject({
            ...project,
            ci: [...project.ci, newScript]
        });
        setNewScript('');
    };

    const handleScriptDelete = (index) => {
        const updatedScripts = [...project.ci];
        updatedScripts.splice(index, 1);
        setProject({
            ...project,
            ci: updatedScripts
        });
    };

    const handleInputChange = (event) => {
        if (event.target.name === 'newPort') {
            setNewPort(event.target.value);
        } else if (event.target.name === 'newScript') {
            setNewScript(event.target.value);
        }
    };

    return (
        <div className="project-manager">
            <div className="project-menu">
                <ul>
                    <li className={activeMenu === 'return' ? 'active' : ''} onClick={() => handleMenuClick('return')}>Return</li>
                    <li className={activeMenu === 'general' ? 'active' : ''} onClick={() => handleMenuClick('general')}>General</li>
                    <li className={activeMenu === 'build & deploy' ? 'active' : ''} onClick={() => handleMenuClick('build & deploy')}>Build & Deploy</li>
                    <li className={activeMenu === 'ports' ? 'active' : ''} onClick={() => handleMenuClick('ports')}>Ports</li>
                    <li className={activeMenu === 'ci' ? 'active' : ''} onClick={() => handleMenuClick('ci')}>CI</li>
                    <li className={activeMenu === 'env' ? 'active' : ''} onClick={() => handleMenuClick('env')}>Environment Variables</li>
                    <li className={activeMenu === 'logs' ? 'active' : ''} onClick={() => handleMenuClick('logs')}>Logs</li>
                    <li className={activeMenu === 'consolessh' ? 'active' : ''} onClick={() => handleMenuClick('consolessh')}>Console SSH</li>
                </ul>
            </div>
            <div className="project-details">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {activeMenu === 'general' && (
                            <>
                                <div>
                                    <h2>Project details</h2>
                                    <p>General information about your project</p>
                                </div>
                                <div className='element'>
                                    <h2>Project Infos:</h2>
                                    <ul>
                                        <li>Name: {project.name}</li>
                                        <li>Owner: {project.owner}</li>
                                        <li>ID: {project.alias}</li>
                                        <li>Created: {project.date}</li>
                                        <li>Last update: {project.lastupdate}</li>
                                    </ul>
                                </div>
                                <div className='element'>
                                    <h2>Project Uses:</h2>
                                    <ul>
                                        {project.docker.use && project.docker.use.map((use) => {
                                            return (
                                                <>
                                                    <li>Name: {use}</li>
                                                </>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className='element tomato'>
                                    <h2>DANGER ZONE:</h2>
                                    <p>Irreversible and destructive actions</p>
                                    <ul>
                                        <li>
                                            <div className='title'>
                                                Delete project
                                            </div>
                                            <div className='content'>
                                                <p>One you delete a project, there is no going back.</p>
                                                <button className="danger_button">
                                                    Delete this project
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                        {activeMenu === 'build & deploy' && (
                            <>
                                <div>
                                    <h2>Continuous deployment</h2>
                                    <p>Settings for continuous deployment from a Git repository</p>
                                </div>
                                <div className='element'>
                                    <div className='title'>
                                        Repository
                                    </div>
                                    <div className='desc'>
                                        <p>Your project is linked to a Git repository for continuous deployment.</p>
                                    </div>
                                    <div className='content'>
                                        <ul>
                                            <li>Current repository: {project.repo.mode === 'private' && <FaLock />}<a target='_blank' href={project.repo.url}>{project.repo.url}</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='element'>
                                    <div className='title'>
                                        Build settings
                                    </div>
                                    <div className='content'>
                                        <ul>
                                            <li>Runtime: {project.repo.url.mode}</li>
                                            <li>Build commands: {project.ci.run}</li>
                                            <li>Build status: {project.repo.url}</li>
                                        </ul>
                                    </div>
                                    <button>Edit settings</button>
                                </div>
                                <div className='element'>
                                    <div className='title'>
                                        Branches and deploy contexts
                                    </div>
                                    <div className='desc'>
                                        <p>Deploy contexts are branch-bases environments that enable you to configure builds depending on the context. This includes production and preview environments.</p>
                                    </div>
                                    <div className='content'>
                                        <ul>
                                            <li>Production branch: {project.repo.url.branch}</li>
                                            <li>Branch deploys: {project.ci.run}</li>
                                        </ul>
                                    </div>
                                    <button>Edit settings</button>
                                </div>
                                <div className='element'>
                                    <div className='title'>
                                        Build image selection
                                    </div>
                                    <div className='desc'>
                                        <p>Select a different build image to change the operating system and supported software versions in the environment where our buildbot builds your project.</p>
                                    </div>
                                    <div className='content'>
                                        <ul>
                                            <li>Build image: {project.docker.image}</li>
                                        </ul>
                                    </div>
                                    <button>Edit settings</button>
                                </div>
                                <div className='element'>
                                    <div className='title'>
                                        Build notifications
                                    </div>
                                    <div className='desc'>
                                        <p>Set up outgoing webhooks to notify other services about deploys for your project.</p>
                                    </div>
                                    <div className='content'>
                                        <ul>
                                            <li>Build image: {project.docker.image}</li>
                                        </ul>
                                    </div>
                                    <button>Edit settings</button>
                                </div>
                            </>

                        )}
                        {activeMenu === 'ports' && (
                            <>
                                <h2>Ports</h2>
                                <div className='element'>
                                    <ul>
                                        {project.docker.ports && project.docker.ports.map((port, index) => (
                                            <li key={index}>
                                                <a target='_blank' href={`http://${config.server.host}:${port.host}/`}>{port.container}</a>
                                                <button onClick={() => handlePortDelete(index)}><RiDeleteBin6Line /></button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div>
                                        <input type="number" autoComplete='off' name="newPort" value={newPort} onChange={handleInputChange} />
                                        <button onClick={handlePortAdd}>Add</button>
                                    </div>
                                </div>
                            </>

                        )}
                        {activeMenu === 'ci' && (
                            <>
                                <h2>CI</h2>
                                <div className='element'>
                                    <ul>
                                        {project.ci && project.ci.map((script, index) => (
                                            <li key={index}>
                                                {script.name}
                                                {script.run}
                                                <button onClick={() => handleScriptDelete(index)}><RiDeleteBin6Line /></button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div>
                                        <textarea type="text" name="newScript" value={newScript} onChange={handleInputChange} />
                                        <button onClick={handleScriptAdd}>Add</button>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeMenu === 'env' && (
                            <>
                                <h2>Environment Variables</h2>
                                <p>Securely store secrets, API keys, tokens, and other environment variables</p>
                                <div className='element'>
                                    {project.docker.env && project.docker.env.map((variable, index) => (
                                        <li key={index}>
                                            {variable}
                                            <button onClick={() => handleVariableDelete(index)}><RiDeleteBin6Line /></button>
                                        </li>
                                    ))}
                                </div>
                                <div>
                                    {/* <input type="text" name="newVariable" value={newVariable} onChange={handleInputChange} /> */}
                                    {/* <input type="text" name="newValue" value={newValue} onChange={handleInputChange} /> */}
                                    {/* <button onClick={handleVariableAdd}>Add</button> */}
                                </div>
                            </>
                        )}
                        {activeMenu === 'logs' && (
                            <>
                                <TerminalSSH config={config} containerName={project.docker.dockerID} />
                            </>
                        )}
                        {activeMenu === 'consolessh' && (
                            <>
                                <TerminalSSH config={config} containerName={project.docker.dockerID} />
                                <Monitor config={config} containerName={project.docker.dockerID} />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectManager;
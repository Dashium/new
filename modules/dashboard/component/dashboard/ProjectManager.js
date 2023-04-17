import { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import axios from 'axios';

function ProjectManager({ config, projectId }) {
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
                    <li className={activeMenu === 'general' ? 'active' : ''} onClick={() => handleMenuClick('general')}>General</li>
                    <li className={activeMenu === 'ports' ? 'active' : ''} onClick={() => handleMenuClick('ports')}>Ports</li>
                    <li className={activeMenu === 'ci' ? 'active' : ''} onClick={() => handleMenuClick('ci')}>CI</li>
                    <li className={activeMenu === 'env' ? 'active' : ''} onClick={() => handleMenuClick('env')}>Environment Variables</li>
                </ul>
            </div>
            <div className="project-details">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {activeMenu === 'general' && (
                            <>
                                <h2>{project.name}</h2>
                                <p>{project.description}</p>
                            </>
                        )}
                        {activeMenu === 'ports' && (
                            <>
                                <h2>Ports</h2>
                                <ul>
                                    {project.docker.ports.map((port, index) => (
                                        <li key={index}>
                                            {port.container}
                                            <button onClick={() => handlePortDelete(index)}><RiDeleteBin6Line /></button>
                                        </li>
                                    ))}
                                </ul>
                                <div>
                                    <input type="text" name="newPort" value={newPort} onChange={handleInputChange} />
                                    <button onClick={handlePortAdd}>Add</button>
                                </div>
                            </>

                        )}
                        {activeMenu === 'ci' && (
                            <>
                                <h2>CI</h2>
                                <ul>
                                    {project.ci.map((script, index) => (
                                        <li key={index}>
                                            {script.name}
                                            {script.run}
                                            <button onClick={() => handleScriptDelete(index)}><RiDeleteBin6Line /></button>
                                        </li>
                                    ))}
                                </ul>
                                <div>
                                    <input type="text" name="newScript" value={newScript} onChange={handleInputChange} />
                                    <button onClick={handleScriptAdd}>Add</button>
                                </div>
                            </>
                        )}
                        {activeMenu === 'env' && (
                            <>
                                <h2>Environment Variables</h2>
                                <ul>
                                    {project.docker.env.map((variable, index) => (
                                        <li key={index}>
                                            {variable}
                                            <button onClick={() => handleVariableDelete(index)}><RiDeleteBin6Line /></button>
                                        </li>
                                    ))}
                                </ul>
                                <div>
                                    {/* <input type="text" name="newVariable" value={newVariable} onChange={handleInputChange} /> */}
                                    {/* <input type="text" name="newValue" value={newValue} onChange={handleInputChange} /> */}
                                    {/* <button onClick={handleVariableAdd}>Add</button> */}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectManager;
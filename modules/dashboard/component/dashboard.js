import React, { useState, useEffect } from 'react';
import { FaRegObjectGroup, FaProjectDiagram, FaPlug, FaCog } from 'react-icons/fa';
var config = require('../../../config/global.json');
import AuthRoute from './authroute';

import Navbar from './dashboard/navbar';
import LogoSelector from './logoselector';

import Project from './dashboard/ProjectList';
import ProjectManager from './dashboard/ProjectManager';
import ClusterList from './dashboard/clusterList';
import DashiumUpdater from './dashboard/update';

import AddProjectForm from './dashboard/AddProject';
import SetupApplication from './dashboard/setupIntegrations';

const Dashboard = ({ }) => {
    const [cluster, setCluster] = useState(null);
    const [clusterId, setClusterId] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [project, setProject] = useState(null);
    const [mode, setMode] = useState('project');
    const [menu, setMenu] = useState('dashboard');

    const handleOptionSelect = (option) => {
        setMode(option.label);
    };

    const options = [
        { id: 1, label: "Cluster", logo: FaRegObjectGroup },
        { id: 2, label: "Project", logo: FaProjectDiagram },
        { id: 3, label: "Integration", logo: FaPlug },
        { id: 4, label: "Paramètre", logo: FaCog },
    ];

    useEffect(() => {
        setProject(false);
    }, [projectId]);

    return (
        <AuthRoute config={config}>
            <div>
                <div>
                    <DashiumUpdater config={config} repoName={'Dashium/new'}></DashiumUpdater>
                    {menu === 'dashboard' && (
                        <>
                            {!projectId && (
                                <div className='cluster-container'>
                                    <h1>Dashboard</h1>
                                    <p>Welcome to the dashium, my name is {config.server.name}.</p>
                                    <div>
                                        <LogoSelector options={options} onSelect={handleOptionSelect} />
                                    </div>
                                </div>
                            )}
                            {mode === 'Cluster' && (
                                <ClusterList config={config} setclusterId={setClusterId} setcluster={setCluster} setMode={setMode} />
                            )}
                            {mode === 'Project' && (
                                <Project config={config} setProjectId={setProjectId} setProject={setProject} setMenu={setMenu} setMode={setMode} />
                            )}
                            {projectId && (
                                <ProjectManager config={config} projectId={projectId.id} setProjectId={setProjectId} setMode={setMode} />
                            )}
                        </>
                    )}
                    {menu == 'addproject' &&
                        <AddProjectForm config={config} setMenu={setMenu}></AddProjectForm>
                    }
                    {mode == 'Integration' &&
                        <SetupApplication config={config} setMenu={setMenu}></SetupApplication>
                    }
                </div>
            </div>

            {/* <Navbar></Navbar> */}
        </AuthRoute>
    );
};

export default Dashboard;

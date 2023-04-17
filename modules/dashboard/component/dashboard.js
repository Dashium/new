import React, { useState, useEffect } from 'react';
var config = require('../../../config/global.json');
import AuthRoute from './authroute';

import Sidebar from './sidebar';
import Navbar from './dashboard/navbar';

import Monitor from './dashboard/monitor';
import TerminalSSH from './dashboard/terminal';
import Project from './dashboard/ProjectList';
import ProjectManager from './dashboard/ProjectManager';
import ClusterList from './dashboard/clusterList';
import DashiumUpdater from './dashboard/update';

const Dashboard = () => {
    const [projectId, setProjectId] = useState(1);
    const [project, setProject] = useState(null);

    useEffect(() => {
        setProject(false);
    }, [projectId]);

    return (
        <AuthRoute>
            <div>
                <h1>Dashboard</h1>
                <p>Welcome to the dashium, my name is {config.server.name}</p>
            </div>

            {/* <Sidebar config={config}></Sidebar> */}

            <div>
                <div>
                    <DashiumUpdater config={config} repoName={'dashium/new'}></DashiumUpdater>
                    <ClusterList config={config}></ClusterList>
                    <Project config={config} setProjectId={setProjectId} setProject={setProject} />
                    {project && (
                        <>
                            <ProjectManager config={config} projectId={projectId.id} />
                            <Monitor config={config} containerName={projectId.docker.dockerID} />
                            <TerminalSSH config={config} containerName={projectId.docker.dockerID} />
                        </>
                    )}

                </div>
            </div>

            <Navbar></Navbar>
        </AuthRoute>
    );
};

export default Dashboard;

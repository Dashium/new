import React, { useState, useEffect } from 'react';
var config = require('../../../config/global.json');
import AuthRoute from './authroute';

import Navbar from './dashboard/navbar';

import Project from './dashboard/ProjectList';
import ProjectManager from './dashboard/ProjectManager';
import ClusterList from './dashboard/clusterList';
import DashiumUpdater from './dashboard/update';

import AddProjectForm from './dashboard/AddProject';
import SetupApplication from './dashboard/setupIntegrations'

const Dashboard = ({ }) => {
    const [projectId, setProjectId] = useState(null);
    const [project, setProject] = useState(null);
    const [mode, setMode] = useState('project');
    const [menu, setMenu] = useState('dashboard');

    useEffect(() => {
        setProject(false);
    }, [projectId]);

    return (
        <AuthRoute config={config}>
            <div>
                <div>
                    <DashiumUpdater config={config} repoName={'dashium/new'}></DashiumUpdater>
                    {menu === 'dashboard' && (
                        <>
                            {!projectId && (
                                <div className='cluster-container'>
                                    <h1>Dashboard</h1>
                                    <p>Welcome to the dashium, my name is {config.server.name}.</p>
                                </div>
                            )}
                            {mode === 'cluster' && (
                                <ClusterList config={config} setMode={setMode} />
                            )}
                            {mode === 'project' && (
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
                    {menu == 'addinteg' &&
                        <SetupApplication config={config} setMenu={setMenu}></SetupApplication>
                    }
                </div>
            </div>

            <Navbar></Navbar>
        </AuthRoute>
    );
};

export default Dashboard;

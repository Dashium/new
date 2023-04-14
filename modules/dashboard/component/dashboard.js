var config = require('../../../config/global.json');
import AuthRoute from './authroute';

import Sidebar from './sidebar';
import Navbar from './dashboard/navbar';

import Monitor from './dashboard/monitor';
import TerminalSSH from './dashboard/terminal';
import Project from './dashboard/projects';

const Dashboard = () => {
    return (
        <AuthRoute>
            <div>
                <h1>Dashboard</h1>
                <p>Welcome to the dashium, my name is {config.server.name}</p>
            </div>

            {/* <Sidebar config={config}></Sidebar> */}

            <div>
                {/* <Monitor config={config} containerName={'o7vZWjYh31'}></Monitor>
                <TerminalSSH config={config} containerName={'o7vZWjYh31'}></TerminalSSH> */}
                <Project config={config}></Project>
                <ProjectManager config={config} projectId={1}></ProjectManager>
            </div>

            <Navbar></Navbar>
        </AuthRoute>
    );
};

export default Dashboard;

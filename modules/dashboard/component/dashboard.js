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
                <p>Welcome to the dashboard</p>
            </div>

            {/* <Sidebar></Sidebar> */}

            <div>
                {/* <Monitor containerName={'o7vZWjYh31'}></Monitor>
                <TerminalSSH containerName={'o7vZWjYh31'}></TerminalSSH> */}
                <Project></Project>
            </div>

            <Navbar></Navbar>
        </AuthRoute>
    );
};

export default Dashboard;

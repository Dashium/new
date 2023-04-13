import AuthRoute from './authroute';

import Sidebar from './sidebar';
import Navbar from './navbar';

import Monitor from './monitor';
import TerminalSSH from './terminal';

const Dashboard = () => {
    return (
        <AuthRoute>
            <div>
                <h1>Dashboard</h1>
                <p>Welcome to the dashboard</p>
            </div>

            {/* <Sidebar></Sidebar> */}

            <div style={{
                position: 'relative',
                top: '2%',
                left: '2%',
                right: '2%',
                width: '100%'
            }}>
                <Monitor containerName={'o7vZWjYh31'}></Monitor>
                <TerminalSSH containerName={'o7vZWjYh31'}></TerminalSSH>
            </div>

            <Navbar></Navbar>
        </AuthRoute>
    );
};

export default Dashboard;

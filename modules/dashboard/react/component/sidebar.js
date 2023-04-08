import React, { useState } from "react";
import { useQuery, gql } from '@apollo/client';

const GET_LINKS = gql(`
{
    projects {
        id
        name
        repo
        cluster {
            id
            name
            alias
            path
        }
    }
}
`);

const Sidebar = () => {
    const [openDashboard, setOpenDashboard] = useState(false);
    const [openClusters, setOpenClusters] = useState(false);
    const [openProjects, setOpenProjects] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [links, setLinks] = useState([
        { label: "Dashboard", href: "#" },
        { label: "Clusters", href: "#" },
        { label: "Projects", href: "#" },
        { label: "Settings", href: "#" },
    ]);

    const { loading, error, data } = useQuery(GET_LINKS);

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error :(</p>;
    console.log(data);

    // const links = data;


    const handleDashboardClick = () => {
        setOpenDashboard(!openDashboard);
    };

    const handleClustersClick = () => {
        setOpenClusters(!openClusters);
    };

    const handleProjectsClick = () => {
        setOpenProjects(!openProjects);
    };

    const handleSettingsClick = () => {
        setOpenSettings(!openSettings);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src='/logo512.png' alt="logo" />
            </div>
            <div className="sidebar-menu">
                <div className="sidebar-menu__item menu-item" onClick={handleDashboardClick}>
                    <span>Dashboard</span>
                </div>
                <div className="sidebar-menu__item menu-item" onClick={handleClustersClick}>
                    <span>Clusters</span>
                    {openClusters ? (
                        <i className="fa fa-chevron-up"></i>
                    ) : (
                        <i className="fa fa-chevron-down"></i>
                    )}
                    <div className="sidebar-submenu">
                        {openClusters &&
                            links.map((link, index) => (
                                <div className="sidebar-menu__item">
                                    <a key={index} href={link.href}>
                                        {link.label}
                                    </a>
                                </div>
                            )
                            )}
                    </div>
                </div>
                <div className="sidebar-menu__item menu-item" onClick={handleProjectsClick}>
                    <span>Projects</span>
                    {openProjects ? (
                        <i className="fa fa-chevron-up"></i>
                    ) : (
                        <i className="fa fa-chevron-down"></i>
                    )}
                    <div className="sidebar-submenu">
                        {openProjects &&
                            links.map((link, index) => (
                                <div className="sidebar-menu__item">
                                    <a key={index} href={link.href}>
                                        {link.label}
                                    </a>
                                </div>
                            )
                            )}
                    </div>
                </div>
                <div className="sidebar-menu__item menu-item" onClick={handleSettingsClick}>
                    <span>Settings</span>
                    {openSettings ? (
                        <i className="fa fa-chevron-up"></i>
                    ) : (
                        <i className="fa fa-chevron-down"></i>
                    )}
                    <div className="sidebar-submenu">
                        {openSettings &&
                            links.map((link, index) => (
                                <div className="sidebar-menu__item">
                                    <a key={index} href={link.href}>
                                        {link.label}
                                    </a>
                                </div>
                            )
                            )}
                    </div>
                </div>
            </div>
            <div className="sidebar-footer">Dashium v1.0</div>
        </div>
    );
};

export default Sidebar;

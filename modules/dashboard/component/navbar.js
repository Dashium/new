import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { BsFillGridFill, BsFileEarmarkCodeFill, BsGearFill, BsArrowRepeat, BsStopFill } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';

function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    function handleMenuClick() {
        setShowMenu(!showMenu);
    }

    function handleCloseMenu() {
        setShowMenu(false);
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="/logo512.png" alt="Logo" onClick={handleMenuClick} />
                <button className="navbar-menu-btn">
                    {showMenu ? <IoMdClose /> : <FaBars />}
                </button>
            </div>
            <div className={`navbar-menu2 ${showMenu ? 'navbar-menu-show' : ''}`}>
                <button className="navbar-menu-item">
                    <BsArrowRepeat />
                    <span>Redémarrage</span>
                </button>
                <button className="navbar-menu-item">
                    <BsStopFill />
                    <span>Stop</span>
                </button>
            </div>
            <div className="navbar-menu">
                <button className="navbar-menu-item">
                    <BsFillGridFill />
                    <span>Gestionnaire de cluster</span>
                </button>
                <button className="navbar-menu-item">
                    <BsFileEarmarkCodeFill />
                    <span>Gestionnaire de projets</span>
                </button>
                <button className="navbar-menu-item">
                    <BsGearFill />
                    <span>Paramètres</span>
                </button>
            </div>
            <div className="navbar-right">
                <span className="navbar-date">{time.toLocaleDateString()}</span>
                <span className="navbar-time">{time.toLocaleTimeString()}</span>
            </div>
        </nav>
    );
}

export default Navbar;

/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Headers from '../component/header';
import Background from '../component/background';
import Loading from '../component/loading';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        // Supprimer le cookie d'authentification
        Cookies.remove('auth_token');
        // Rediriger vers la page de connexion
        setTimeout(() => router.push('/login'), 5000);
    }, [router]);

    return (
        <div className='app' style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',

            userSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none'
        }}>
            <Headers title='Logout'></Headers>
            <Background mode='color' />
            <Loading text='Déconnexion en cours...'></Loading>
        </div>
    );
};

export default Logout;

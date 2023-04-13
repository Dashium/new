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
    }, []);

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
            <Headers></Headers>
            <Background mode='color' />
            <Loading text='Déconnexion en cours...'></Loading>
        </div>
    );
};

export default Logout;

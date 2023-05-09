/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

const checkAuth = async ({ config }) => {
    const token = Cookies.get('auth_token');
    if (!token) {
        // throw new Error('No token found');
        console.error('No token found');
        return false;
    }

    // Vérifier si le token est valide en le vérifiant avec le serveur
    const response = (await axios.post(`https://${config.api.host}:${config.api.port}/check-token`, {token: token})).data;

    if (!response.message) {
        // throw new Error('Invalid token');
        console.error('Invalid token');
        return false;
    }

    return true;
};

const AuthRoute = ({ children, config }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        try {
            checkAuth({ config }).then((data) => {
                setIsAuthenticated(data);
                if(data == false){
                    router.push('/login');
                }
            });
        } catch (error) {
            router.push('/login');
        }
    }, [router, config]);

    return isAuthenticated ? children : null;
};

export default AuthRoute;

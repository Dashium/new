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

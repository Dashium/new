import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const checkAuth = () => {
    const token = Cookies.get('auth_token');
    if (!token) {
        throw new Error('No token found');
    }

    // TODO: Vérifier si le token est valide en le vérifiant avec le serveur

    return true;
};

const AuthRoute = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        try {
            setIsAuthenticated(checkAuth());
        } catch (error) {
            router.push('/login');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isAuthenticated ? children : null;
};

export default AuthRoute;

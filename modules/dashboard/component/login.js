/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Popup from './popup';

const Login = ({ api }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [displayPopup, setDisplayPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ popupMessage: '', mode: '' });
    const router = useRouter();

    const handleRegister = async () => {
        try {
            const response = await axios.post(`https://${api.host}:${api.port}/register`, {
                email,
                password,
                confirmPassword
            });
            if (response.data.message != null) { setPopupMessage({ popupMessage: response.data.message, mode: "success" }); }
            if (response.data.error != null) { setPopupMessage({ popupMessage: response.data.error, mode: "error" }); }
            setDisplayPopup(true);
            setTimeout(() => setDisplayPopup(false), 5000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`https://${api.host}:${api.port}/login`, {
                email,
                password
            });
            if (response.data.message != null) { setPopupMessage({ popupMessage: response.data.message, mode: "success" }); }
            if (response.data.error != null) { setPopupMessage({ popupMessage: response.data.error, mode: "error" }); }
            setDisplayPopup(true);
            setTimeout(() => {
                setDisplayPopup(false);
                if (response.data.token != null) {
                    Cookies.set('auth_token', response.data.token);
                    router.push('/');
                }
            }, 5000);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isRegister) {
            handleRegister();
        } else {
            handleLogin();
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-container">
                    <img src="/logo512.png" alt="Logo" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {isRegister && (
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                    )}
                    <div className='buttons'>
                        <button onClick={toggleMode}>{isRegister ? 'Se connecter' : 'S\'inscrire'}</button>
                        <button type="submit">{isRegister ? 'S\'inscrire' : 'Se connecter'}</button>
                    </div>
                </form>
            </div>
            {displayPopup && <Popup message={popupMessage.popupMessage} type={popupMessage.mode} onClose={() => setDisplayPopup(false)} />}
        </div>
    );
};

export default Login;

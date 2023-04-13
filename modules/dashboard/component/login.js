/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isRegister) {
            // Code pour soumettre le formulaire d'inscription
        } else {
            // Code pour soumettre le formulaire de connexion
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
        </div>
    );
};

export default Login;

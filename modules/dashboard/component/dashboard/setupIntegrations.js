import React, { useState } from "react";
import { AiFillGithub, AiFillGitlab } from "react-icons/ai";
import { FaBitbucket } from "react-icons/fa";

const SetupApplication = () => {
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [appId, setAppId] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        // Code pour soumettre les informations d'application configurées
    };

    const handlePlatformChange = (event) => {
        setSelectedPlatform(event.target.value);
    };

    const githubForm = (
        <div className="form">
            <label htmlFor="appId">ID de l'application</label>
            <input
                type="number"
                id="appId"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                required
                autoComplete="off"
            />

            <label htmlFor="privateKey">Clé privée</label>
            <input
                type="text"
                id="privateKey"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                required
                autoComplete="off"
            />
        </div>
    );

    const gitlabForm = (
        <div className="form">
            <label htmlFor="baseUrl">URL de base</label>
            <input
                type="text"
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                required
                autoComplete="off"
            />

            <label htmlFor="appId">ID de l'application</label>
            <input
                type="text"
                id="appId"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                required
                autoComplete="off"
            />

            <label htmlFor="privateKey">Clé privée</label>
            <input
                type="text"
                id="privateKey"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                required
                autoComplete="off"
            />
        </div>
    );

    const bitbucketForm = (
        <div className="form">
            <label htmlFor="baseUrl">URL de base</label>
            <input
                type="text"
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                required
                autoComplete="off"
            />

            <label htmlFor="username">Nom d'utilisateur</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="off"
            />

            <label htmlFor="password">Mot de passe</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off"
            />
        </div>
    );

    return (
        <div className="addInteg">
            <div className="platform-select">
                <button
                    className={`platform-btn ${selectedPlatform === "github" ? "active" : ""
                        }`}
                    onClick={() => setSelectedPlatform("github")}>
                    <AiFillGithub />
                </button>
                <button
                    className={`platform-btn ${selectedPlatform === "gitlab" ? "active" : ""
                        }`}
                    onClick={() => setSelectedPlatform("gitlab")}
                >
                    <AiFillGitlab />
                </button>
                <button
                    className={`platform-btn ${selectedPlatform === "bitbucket" ? "active" : ""
                        }`}
                    onClick={() => setSelectedPlatform("bitbucket")}
                >
                    <FaBitbucket />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {selectedPlatform === "github" && githubForm}
                {selectedPlatform === "gitlab" && gitlabForm}
                {selectedPlatform === "bitbucket" && bitbucketForm}

                <button type="submit">Valider</button>
            </form>
        </div >
    );
};

export default SetupApplication;
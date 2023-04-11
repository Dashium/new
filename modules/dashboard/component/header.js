import React from 'react';
import Head from 'next/head'

const Headers = () => {
    return (
        <div>
            <Head>
                <title>Mon titre de page</title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/css/fontawesome/css/all.min.css" />
                <link rel="stylesheet" href="/css/sidebar.css" />
                <link rel="stylesheet" href="/css/monitor.css" />
                <link rel="stylesheet" href="/css/terminal.css" />
            </Head>
        </div>
    );
};

export default Headers;

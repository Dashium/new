/* eslint-disable @next/next/no-css-tags */
import React from 'react';
import Head from 'next/head'

const Headers = ({ title }) => {
    return (
        <div>
            <Head>
                <title>Dashium | {title ? title : 'Tai Studio'}</title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="stylesheet" href="/font/Heebo.css" />
            </Head>
        </div>
    );
};

export default Headers;

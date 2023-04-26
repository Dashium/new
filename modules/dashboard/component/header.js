/* eslint-disable @next/next/no-css-tags */
import React from 'react';
import Head from 'next/head'

const Headers = ({ title }) => {
    if (typeof title != 'string') { title = 'Tai Studio'; }
    return (
        <Head>
            <title>{`Dashium | ${title}`}</title>
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="stylesheet" href="/font/Heebo.css" />
        </Head>
    );
};

export default Headers;

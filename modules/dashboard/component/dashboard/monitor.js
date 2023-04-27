import React from 'react';

const Monitor = ({ config, containerName }) => {
    return (
      <div className="monitor">
        <iframe src={`https://${config.monitor.host}:${config.monitor.port}/${containerName}`}></iframe>
       </div>
    );
};

export default Monitor;

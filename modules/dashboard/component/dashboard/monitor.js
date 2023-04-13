import React from 'react';
var config = require('../../../../config/global.json');

const Monitor = ({ containerName }) => {
    return (
      <div className="monitor">
        <iframe src={`http://${config.monitor.host}:${config.monitor.port}/${containerName}`}></iframe>
       </div>
    );
};

export default Monitor;

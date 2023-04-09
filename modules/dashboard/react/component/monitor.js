import React, { useState, useEffect } from 'react';
import axios from 'axios';
var config = require('../../../../config/global.json');

const Monitor = ({ containerName }) => {
    // const [cpuUsage, setCpuUsage] = useState('OFF');
    // const [memoryUsage, setMemoryUsage] = useState('OFF');
    // const [networkIn, setNetworkIn] = useState('OFF');
    // const [networkOut, setNetworkOut] = useState('OFF');

    // useEffect(() => {
    //   const interval = setInterval(() => {
    //     axios.get(`/monitor/${containerName}`)
    //       .then(response => {
    //         setCpuUsage(response.data.cpuUsage);
    //         setMemoryUsage(response.data.memoryUsage);
    //         setNetworkIn(response.data.networkIn);
    //         setNetworkOut(response.data.networkOut);
    //       })
    //       .catch(error => console.log(error));
    //   }, 1000);
    //   return () => clearInterval(interval);
    // }, []);

    // return (
    //   <div className="monitor-container">
    //     <div className="monitor-item">
    //       <span>CPU Usage:</span>
    //       <span>{cpuUsage}</span>
    //     </div>
    //     <div className="monitor-item">
    //       <span>Memory Usage:</span>
    //       <span>{memoryUsage}</span>
    //     </div>
    //     <div className="monitor-item">
    //       <span>Network In:</span>
    //       <span>{networkIn}</span>
    //     </div>
    //     <div className="monitor-item">
    //       <span>Network Out:</span>
    //       <span>{networkOut}</span>
    //     </div>
    //   </div>
    // );

    return (
      <div className="monitor">
        <iframe src={`http://${config.monitor.host}:${config.monitor.port}/${containerName}`}></iframe>
       </div>
    );
};

export default Monitor;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Monitor = () => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [networkIn, setNetworkIn] = useState(0);
  const [networkOut, setNetworkOut] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('/monitor/0')
        .then(response => {
          setCpuUsage(response.data.cpuUsage);
          setMemoryUsage(response.data.memoryUsage);
          setNetworkIn(response.data.networkIn);
          setNetworkOut(response.data.networkOut);
        })
        .catch(error => console.log(error));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="monitor-container">
      <div className="monitor-item">
        <span>CPU Usage:</span>
        <span>{cpuUsage.toFixed(2)}%</span>
      </div>
      <div className="monitor-item">
        <span>Memory Usage:</span>
        <span>{(memoryUsage / 1048576).toFixed(2)} MB</span>
      </div>
      <div className="monitor-item">
        <span>Network In:</span>
        <span>{(networkIn / 1024).toFixed(2)} KB/s</span>
      </div>
      <div className="monitor-item">
        <span>Network Out:</span>
        <span>{(networkOut / 1024).toFixed(2)} KB/s</span>
      </div>
    </div>
  );
};

export default Monitor;

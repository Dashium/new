import { useEffect, useRef } from 'react';

const TerminalSSH = ({ containerName, sshPort }) => {
  const terminalRef = useRef();
  const ws = useRef();

  useEffect(() => {
    const terminal = terminalRef.current;
    const socketUrl = `ws://${window.location.hostname}:${sshPort}`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      terminal.innerHTML += 'Connected to SSH\n';
      ws.current.send(`ssh ${containerName}\n`);
    };

    ws.current.onmessage = (event) => {
      terminal.innerHTML += event.data;
    };

    ws.current.onerror = () => {
      terminal.innerHTML += 'Failed to connect to SSH\n';
    };

    ws.current.onclose = () => {
      terminal.innerHTML += 'Disconnected from SSH\n';
    };

    return () => {
      ws.current.close();
    };
  }, [containerName, sshPort]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      ws.current.send(event.target.innerText);
      event.target.innerText = '';
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-dot terminal-red"></div>
          <div className="terminal-dot terminal-yellow"></div>
          <div className="terminal-dot terminal-green"></div>
        </div>
        <div className="terminal-title">SSH Terminal</div>
      </div>
      <div className="terminal-body" ref={terminalRef} contentEditable onKeyDown={handleKeyDown}></div>
    </div>
  );
};

export default TerminalSSH;

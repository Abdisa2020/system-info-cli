function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

export function renderText(data) {
  const { host, os, cpu, memory, runtime } = data;

  return `
  ========================================
         SYSTEM & RUNTIME REPORT          
  ========================================
  [Node.js Environment]
    Node Version   : ${runtime.nodeVersion}
    V8 Engine      : ${runtime.v8Version}
    Libuv          : ${runtime.libuvVersion}
    Process PID    : ${runtime.pid}
  
  [Host & OS]
    Hostname       : ${host.hostname}
    User           : ${host.userInfo.username}
    OS Platform    : ${os.platform} (${os.arch})
    Kernel Release : ${os.release}
    System Uptime  : ${formatUptime(host.uptimeSeconds)}
  
  [CPU Details]
    Model          : ${cpu.model}
    Cores          : ${cpu.cores} @ ${cpu.speedMhz} MHz
    Load Avg (15m) : ${cpu.loadAvg.map((l) => l.toFixed(2)).join(", ")}
  
  [Memory Allocation]
    Total RAM      : ${memory.system.totalMB} MB
    Used RAM       : ${memory.system.usedMB} MB (${memory.system.usagePercent}%)
    Free RAM       : ${memory.system.freeMB} MB
    Process Heap   : ${memory.process.heapUsedMB} MB / ${
    memory.process.heapTotalMB
  } MB
  ========================================`;
}

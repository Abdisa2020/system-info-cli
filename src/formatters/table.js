function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

export function renderText(data) {
  const { system, memory, runtime } = data;

  return `
  ========================================
         SYSTEM & RUNTIME REPORT          
  ========================================
  [Node.js Environment]
    Node Version   : ${runtime.nodeVersion}
    V8 Engine      : ${runtime.v8Version}
    Libuv          : ${runtime.libuvVersion}
    Process PID    : ${runtime.pid}
  
  [Host Machine]
    OS Platform    : ${system.platform} (${system.arch})
    Kernel Release : ${system.release}
    CPU Model      : ${system.cpuModel} (${system.cpuCores} cores)
    System Uptime  : ${formatUptime(system.uptimeSeconds)}
  
  [Memory Allocation]
    Total RAM      : ${memory.system.totalMB} MB
    Used RAM       : ${memory.system.usedMB} MB (${memory.system.usagePercent}%)
    Free RAM       : ${memory.system.freeMB} MB
    Process Heap   : ${memory.process.heapUsedMB} MB / ${
    memory.process.heapTotalMB
  } MB
  ========================================`;
}

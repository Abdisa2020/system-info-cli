import os from "node:os";

export function getCpuInfo() {
  const cpus = os.cpus() || [];
  const model = cpus.length > 0 ? cpus[0].model.trim() : "Unknown";
  const speed = cpus.length > 0 ? cpus[0].speed : 0; // in MHz

  return {
    model,
    cores: cpus.length,
    speedMhz: speed,
    loadAvg: os.loadavg(), // 1, 5, 15 min load averages
  };
}

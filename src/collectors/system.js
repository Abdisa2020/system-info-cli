import os from "node:os";

export function getSystemInfo() {
  const cpus = os.cpus();
  return {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    uptimeSeconds: Math.floor(os.uptime()),
    cpuModel: cpus.length > 0 ? cpus[0].model.trim() : "Unknown",
    cpuCores: cpus.length,
  };
}

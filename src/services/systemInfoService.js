import { getCpuInfo } from "../collectors/cpu.js";
import { getHostInfo } from "../collectors/host.js";
import { getMemoryInfo } from "../collectors/memory.js";
import { getOsInfo } from "../collectors/os.js";
import { getRuntimeInfo } from "../collectors/runtime.js";

export class SystemInfoService {
  /**
   * Orchestrates system metric collection.
   * Can be reused by CLI, Express routes, or WebSocket daemons.
   */
  getSnapshot() {
    return {
      timestamp: new Date().toISOString(),
      host: getHostInfo(),
      os: getOsInfo(),
      cpu: getCpuInfo(),
      memory: getMemoryInfo(),
      runtime: getRuntimeInfo(),
    };
  }
}

// Export singleton instance for convenient use
export const systemInfoService = new SystemInfoService();

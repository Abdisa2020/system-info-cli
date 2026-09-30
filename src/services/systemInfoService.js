import { getCpuInfo } from "../collectors/cpu.js";
import { getHostInfo } from "../collectors/host.js";
import { getMemoryInfo } from "../collectors/memory.js";
import { getOsInfo } from "../collectors/os.js";
import { getRuntimeInfo } from "../collectors/runtime.js";

export class SystemInfoService {
  /**
   * The constructors recives dependencies from the out side
   * we provide defualt fallbacks so production code doesn't breakk if called with new SystemInforService().
   */

  constructor(collectors = {}) {
    this.collectors = {
      getCpuInfo: collectors.getCpuInfo ?? getCpuInfo,
      getHostInfo: collectors.getHostInfo ?? getHostInfo,
      getMemoryInfo: collectors.getMemoryInfo ?? getMemoryInfo,
      getOsInfo: collectors.getOsInfo ?? getOsInfo,
      getRuntimeInfo: collectors.getRuntimeInfo ?? getRuntimeInfo,
    };
  }

  // Orchestrates metric collection using the injected dependencies stored on `this`.
  getSnapshot() {
    return {
      timestamp: new Date().toISOString(),
      host: this.collectors.getHostInfo(),
      os: this.collectors.getOsInfo(),
      cpu: this.collectors.getCpuInfo(),
      memory: this.collectors.getMemoryInfo(),
      runtime: this.collectors.getRuntimeInfo(),
    };
  }
}

// Default singleton instance using the standard Os collectors
export const systemInfoService = new SystemInfoService();

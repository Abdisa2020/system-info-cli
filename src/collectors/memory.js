import os from "node:os";
import process from "node:process";

function toMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

export function getMemoryInfo() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memoryUsage = process.memoryUsage();

  return {
    system: {
      totalMB: toMB(totalMem),
      freeMB: toMB(freeMem),
      usedMB: toMB(usedMem),
      usagePercent: ((usedMem / totalMem) * 100).toFixed(1),
    },
    process: {
      heapTotalMB: toMB(memoryUsage.heapTotal),
      heapUsedMB: toMB(memoryUsage.heapUsed),
      rssMB: toMB(memoryUsage.rss),
    },
  };
}

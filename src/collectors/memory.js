import os from "node:os";
import process from "node:process";

function toMB(bytes) {
  return Math.round((bytes / 1024 / 1024) * 100) / 100;
}

export function getMemoryInfo() {
  const totalBytes = os.totalmem();
  const freeBytes = os.freemem();
  const usedBytes = totalBytes - freeBytes;
  const memoryUsage = process.memoryUsage();

  const usageRatio = totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0;

  return {
    system: {
      totalMB: toMB(totalBytes),
      freeMB: toMB(freeBytes),
      usedMB: toMB(usedBytes),
      usagePercent: Math.round(usageRatio * 10) / 10,
    },
    process: {
      rssMB: toMB(memoryUsage.rss),
      heapTotalMB: toMB(memoryUsage.heapTotal),
      heapUsedMB: toMB(memoryUsage.heapUsed),
      externalMB: toMB(memoryUsage.external),
    },
  };
}

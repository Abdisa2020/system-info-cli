import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { getCpuInfo } from "../src/collectors/cpu.js";
import { getHostInfo } from "../src/collectors/host.js";
import { getMemoryInfo } from "../src/collectors/memory.js";
import { getOsInfo } from "../src/collectors/os.js";
import { getRuntimeInfo } from "../src/collectors/runtime.js";

describe("Collectors Unit Tests", () => {
  test("getCpuInfo returns valid CPU metadata and numbers", () => {
    const cpu = getCpuInfo();

    assert.equal(typeof cpu.model, "string");
    assert.ok(cpu.model.length > 0, "CPU model should not be empty");
    assert.equal(typeof cpu.cores, "number");
    assert.ok(cpu.cores > 0, "Core count must be greater than 0");
    assert.equal(typeof cpu.speedMhz, "number");
    assert.ok(Array.isArray(cpu.loadAvg), "loadAvg should be an array");
    assert.equal(
      cpu.loadAvg.length,
      3,
      "loadAvg should have 3 metrics [1m, 5m, 15m]"
    );
  });

  test("getHostInfo returns valid hostname and user info", () => {
    const host = getHostInfo();

    assert.equal(typeof host.hostname, "string");
    assert.ok(host.hostname.length > 0);
    assert.equal(typeof host.uptimeSeconds, "number");
    assert.ok(host.uptimeSeconds >= 0);
    assert.equal(typeof host.userInfo.username, "string");
    assert.equal(typeof host.userInfo.homedir, "string");
  });

  test("getMemoryInfo returns pure numeric values and valid bounds", () => {
    const mem = getMemoryInfo();

    // Verify system metrics are numeric (not string from .toFixed)
    assert.equal(typeof mem.system.totalMB, "number");
    assert.equal(typeof mem.system.freeMB, "number");
    assert.equal(typeof mem.system.usedMB, "number");
    assert.equal(typeof mem.system.usagePercent, "number");

    assert.ok(mem.system.totalMB > 0, "Total RAM must be positive");
    assert.ok(
      mem.system.usagePercent >= 0 && mem.system.usagePercent <= 100,
      "Memory usage percentage must be between 0 and 100"
    );

    // Verify process heap numbers
    assert.equal(typeof mem.process.heapUsedMB, "number");
    assert.equal(typeof mem.process.heapTotalMB, "number");
    assert.ok(mem.process.heapUsedMB <= mem.process.heapTotalMB);
  });

  test("getOsInfo returns platform and architecture flags", () => {
    const osInfo = getOsInfo();

    assert.equal(typeof osInfo.platform, "string");
    assert.equal(typeof osInfo.release, "string");
    assert.equal(typeof osInfo.arch, "string");
    assert.ok(["x64", "arm", "arm64", "ia32"].includes(osInfo.arch));
  });

  test("getRuntimeInfo exposes Node.js environment internals", () => {
    const runtime = getRuntimeInfo();

    assert.ok(
      runtime.nodeVersion.startsWith("v"),
      "Node version should begin with v"
    );
    assert.equal(typeof runtime.v8Version, "string");
    assert.equal(typeof runtime.libuvVersion, "string");
    assert.equal(typeof runtime.opensslVersion, "string");
    assert.equal(typeof runtime.pid, "number");
    assert.ok(runtime.pid > 0);
    assert.equal(typeof runtime.cwd, "string");
  });
});

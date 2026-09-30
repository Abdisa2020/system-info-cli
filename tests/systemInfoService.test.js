import assert from "node:assert/strict";
import test from "node:test";
import { SystemInfoService } from "../src/services/systemInfoService.js";

test("SystemInforService.getSnapshot() uses injected dependencies", () => {
  // 1. Arrange: Create fake dependencies (test doubles /stubs)
  const fakeCollectors = {
    getHostInfo: () => ({ hostname: "TEST-MACHINE" }),
    getOsInfo: () => ({ platform: "linux" }),
    getCpuInfo: () => ({ model: "FAKE CPU", cores: 8 }),
    getMemoryInfo: () => ({ total: 1600, free: 8000 }),
    getRuntimeInfo: () => ({ nodeVersion: "v22.0.0" }),
  };

  // 2. Act: Inject the fake collectors into the service
  const service = new SystemInfoService(fakeCollectors);
  const sanpshot = service.getSnapshot();

  // 3. Assert: Check that the snapshot output matches the fake data exactly
  assert.equal(sanpshot.host.hostname, "TEST-MACHINE");
  assert.equal(sanpshot.cpu.model, "FAKE CPU");
  assert.equal(sanpshot.cpu.cores, 8);
  assert.equal(sanpshot.os.platform, "linux");
  assert.equal(sanpshot.memory.total, 1600);
});

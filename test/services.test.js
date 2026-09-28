import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  SystemInfoService,
  systemInfoService,
} from "../src/services/systemInfoService.js";

describe("SystemInfoService Tests", () => {
  test("singleton instance is ready to use", () => {
    assert.ok(systemInfoService instanceof SystemInfoService);
  });

  test("getSnapshot() aggregates all collector domains with timestamp", () => {
    const snapshot = systemInfoService.getSnapshot();

    // Verify root keys exist
    const requiredKeys = [
      "timestamp",
      "host",
      "os",
      "cpu",
      "memory",
      "runtime",
    ];
    for (const key of requiredKeys) {
      assert.ok(key in snapshot, `Snapshot should contain key: ${key}`);
    }

    // Verify ISO timestamp
    assert.ok(
      !isNaN(Date.parse(snapshot.timestamp)),
      "Timestamp should be valid ISO 8601"
    );

    // Verify structural cohesion across components
    assert.equal(typeof snapshot.host.hostname, "string");
    assert.equal(typeof snapshot.os.platform, "string");
    assert.equal(typeof snapshot.cpu.cores, "number");
    assert.equal(typeof snapshot.memory.system.totalMB, "number");
    assert.equal(typeof snapshot.runtime.nodeVersion, "string");
  });
});

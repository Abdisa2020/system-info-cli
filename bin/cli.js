#!/usr/bin/env node

import process from "node:process";
import { getSystemInfo } from "../src/collectors/system.js";
import { getMemoryInfo } from "../src/collectors/memory.js";
import { getRuntimeInfo } from "../src/collectors/runtime.js";
import { renderText } from "../src/formatters/table.js";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage: sys-info [options]

Options:
  -j, --json     Output metrics as raw JSON
  -h, --help     Display this help manual
  -v, --version  Show CLI version
  `);
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  console.log("sys-info-cli v1.0.0");
  process.exit(0);
}

try {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    runtime: getRuntimeInfo(),
    system: getSystemInfo(),
    memory: getMemoryInfo(),
  };

  if (args.includes("--json") || args.includes("-j")) {
    console.log(JSON.stringify(diagnostics, null, 2));
  } else {
    console.log(renderText(diagnostics));
  }
} catch (error) {
  console.error("Fatal: Failed to collect environment metrics:", error.message);
  process.exit(1);
}

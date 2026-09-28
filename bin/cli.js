#!/usr/bin/env node

import process from "node:process";
import { systemInfoService } from "../src/services/systemInfoService.js";
import { renderText } from "../src/formatters/table.js";

const args = process.argv.slice(2);

// 1. Receive CLI arguments
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
  console.log("sys-info-cli v1.1.0");
  process.exit(0);
}

try {
  // 2. Ask service for data
  const data = systemInfoService.getSnapshot();

  // 3 & 4. Choose formatter and display result
  if (args.includes("--json") || args.includes("-j")) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(renderText(data));
  }
} catch (error) {
  console.error("Fatal: Failed to collect environment metrics:", error.message);
  process.exit(1);
}

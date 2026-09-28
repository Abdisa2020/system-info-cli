# Software Architecture Document (SAD) — `sys-info-cli`

## 1. Executive Summary & Purpose

The `sys-info-cli` utility is an operational command-line tool designed for developers, DevOps personnel, and triage engineers. Its primary goal is to gather and display hardware specifications, operating system state, and Node.js runtime configurations with zero external runtime dependencies and sub-100ms execution times.

---

## 2. Architectural Pattern: 3-Tier Pipeline

The system implements a **Layered Unidirectional Data Pipeline Architecture** enforcing strict Separation of Concerns (SoC):

1. **Presentation / Orchestration Layer (`bin/cli.js`)**: Parses command-line arguments, configures process error traps, coordinates metric collection, routes data to the selected serializer, and manages POSIX process exit codes.
2. **Domain / Collection Layer (`src/collectors/`)**: Interfaces directly with low-level runtime APIs (`node:os`, `node:process`) to harvest hardware and platform state. Contains no string formatting or I/O writes.
3. **Serialization / Presentation Layer (`src/formatters/`)**: Accepts normalized domain models and serializes them into human-readable terminal output or standard JSON.

---

## 3. High-Level System Diagram

```
                 +---------------------------+
                 |  CLI Entrypoint (cli.js)  |
                 |   • Flag Parsing          |
                 |   • Error Boundaries      |
                 |   • Exit Code Management  |
                 +-------------+-------------+
                               |
            +------------------+------------------+
            | (Gathers Raw Data)                  | (Selects Output Engine)
            v                                     v
+-----------------------+              +-----------------------+
|   Collectors Layer    |              |   Formatters Layer    |
+-----------------------+              +-----------------------+
| • system.js           |              | • table.js (Human)    |
| • memory.js           |              | • JSON.stringify      |
| • runtime.js          |              +-----------+-----------+
+-----------+-----------+                          |
            |                                      |
            v                                      v
  [Native OS / Runtime]                   [stdout / Terminal]
  • node:os                              • ASCII Card Report
  • node:process                         • Structured JSON
```

---

## 4. Component Matrix & Responsibilities

| Component             | File Path                   | Primary Responsibility                                                | Upstream Caller      | Downstream Dependency     |
| :-------------------- | :-------------------------- | :-------------------------------------------------------------------- | :------------------- | :------------------------ |
| **CLI Controller**    | `bin/cli.js`                | Argument routing, process orchestration, exit code assignment         | CLI Runner / Shell   | Collectors, Formatters    |
| **System Collector**  | `src/collectors/system.js`  | Retrieves CPU architecture, core counts, OS platform, release, uptime | `cli.js`, Unit Tests | `node:os`                 |
| **Memory Collector**  | `src/collectors/memory.js`  | Calculates total/free/used RAM and process heap/RSS allocation        | `cli.js`, Unit Tests | `node:os`, `node:process` |
| **Runtime Collector** | `src/collectors/runtime.js` | Reads Node.js engine, V8, libuv, and OpenSSL release versions         | `cli.js`, Unit Tests | `node:process`            |
| **Table Formatter**   | `src/formatters/table.js`   | Converts diagnostic data into a human-readable ASCII layout           | `cli.js`, Unit Tests | _None (Pure function)_    |

---

## 5. Architectural Principles & Quality Attributes

### 5.1 Zero External Dependencies (Hermetic Runtime)

- The tool intentionally avoids third-party dependencies (`npm install`).
- All operations use native Node.js core modules (`node:os`, `node:process`).
- **Benefits:**
  - Cold-start execution time $< 50\,\text{ms}$.
  - Zero vulnerability supply-chain attack surface.
  - No dependency drift or `node_modules` installation overhead when run via `npx`.

### 5.2 Pure Data Contracts & Testability

- Collector functions return plain JavaScript dictionaries and do not execute `console.log`.
- This decoupling allows unit tests (`tests/collectors.test.js`) to validate data models directly without mocking standard output streams (`stdout`).

### 5.3 Extensible Serialization

- The data collection pipeline produces a standardized dictionary.
- Adding alternate output formats (e.g., `--csv`, `--yaml`, or HTML reports) requires only a new formatter module without modifying collectors or kernel bindings.

### 5.4 Robust Error & Signal Handling

- **Error Boundary:** Top-level errors are intercepted, formatted cleanly to `stderr`, and terminate the process with exit code `1`.
- **Broken Pipe Resilience:** Handles `EPIPE` exceptions on `process.stdout` gracefully to prevent crashes when output is piped to utilities like `head` or `findstr`.

---

## 6. Data Schema

The diagnostics object constructed by `cli.js` adheres to the following contract:

```typescript
interface DiagnosticReport {
  timestamp: string; // ISO 8601 string
  runtime: {
    nodeVersion: string;
    v8Version: string;
    libuvVersion: string;
    opensslVersion: string;
    pid: number;
    cwd: string;
  };
  system: {
    platform: string;
    release: string;
    arch: string;
    uptimeSeconds: number;
    cpuModel: string;
    cpuCores: number;
  };
  memory: {
    system: {
      totalMB: string;
      freeMB: string;
      usedMB: string;
      usagePercent: string;
    };
    process: {
      heapTotalMB: string;
      heapUsedMB: string;
      rssMB: string;
    };
  };
}
```

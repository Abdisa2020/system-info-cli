import process from "node:process";

export function getRuntimeInfo() {
  return {
    nodeVersion: process.version,
    v8Version: process.versions.v8,
    libuvVersion: process.versions.uv,
    opensslVersion: process.versions.openssl,
    pid: process.pid,
    cwd: process.cwd(),
  };
}

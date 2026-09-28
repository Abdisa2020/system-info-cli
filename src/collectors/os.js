import os from "node:os";

export function getOsInfo() {
  return {
    platform: os.platform(),
    release: os.release(),
    type: os.type(),
    arch: os.arch(),
    endianness: os.endianness(),
  };
}

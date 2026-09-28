import os from "node:os";

export function getHostInfo() {
  return {
    hostname: os.hostname(),
    uptimeSeconds: Math.floor(os.uptime()),
    userInfo: {
      username: os.userInfo().username,
      homedir: os.homedir(),
    },
  };
}

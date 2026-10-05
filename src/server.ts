import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export function getPort(): number {
  if (process.env.APP_PORT) {
    return Number(process.env.APP_PORT);
  }
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/APP_PORT\s*=\s*(\d+)/);
    if (match) return Number(match[1]);
  }
  const envExamplePath = path.resolve(process.cwd(), ".env.example");
  if (fs.existsSync(envExamplePath)) {
    const content = fs.readFileSync(envExamplePath, "utf-8");
    const match = content.match(/APP_PORT\s*=\s*(\d+)/);
    if (match) return Number(match[1]);
  }
  return 3000;
}

const command = process.argv[2] || "dev";
const port = getPort();

const nextBin = path.resolve(process.cwd(), "node_modules/next/dist/bin/next");
const child = spawn(
  process.execPath,
  [nextBin, command, "-p", port.toString()],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: port.toString(),
      APP_PORT: port.toString(),
    },
    shell: true,
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

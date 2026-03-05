import { constants } from "node:fs";
import { access, cp, mkdir, rm } from "node:fs/promises";

const standaloneDir = ".next/standalone";
const staticDir = ".next/static";
const publicDir = "public";
const targetDir = "dist";

try {
  await access(standaloneDir, constants.F_OK);
  await access(staticDir, constants.F_OK);
} catch {
  throw new Error(
    `Next standalone artifact not found. Run "npm run build" before preparing artifact.`,
  );
}

await rm(targetDir, { recursive: true, force: true });
await cp(standaloneDir, targetDir, { recursive: true, force: true });

await mkdir(`${targetDir}/.next`, { recursive: true });
await cp(staticDir, `${targetDir}/.next/static`, { recursive: true, force: true });

try {
  await access(publicDir, constants.F_OK);
  await cp(publicDir, `${targetDir}/public`, { recursive: true, force: true });
} catch {
  // Public directory is optional for runtime artifact.
}

console.log(`Prepared Docker artifact: ${targetDir}/`);

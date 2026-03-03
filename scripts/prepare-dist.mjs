import { constants } from "node:fs";
import { access, cp, rm } from "node:fs/promises";

const sourceDir = "out";
const targetDir = "dist";

try {
  await access(sourceDir, constants.F_OK);
} catch {
  throw new Error(
    `Source directory "${sourceDir}" not found. Run "npm run build" before preparing artifact.`,
  );
}

await rm(targetDir, { recursive: true, force: true });
await cp(sourceDir, targetDir, { recursive: true, force: true });

console.log(`Prepared Docker artifact: ${targetDir}/`);

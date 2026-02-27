import { generate } from "openapi-typescript-codegen";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const input =
  process.env.OPENAPI_INPUT ??
  "/Users/ravil/work/fitfluence/fitfluence/openapi/schemas/openapi.yaml";
const output = path.resolve(rootDir, "src/api/gen");

await generate({
  input,
  output,
  httpClient: "fetch",
  useUnionTypes: true,
  useOptions: true,
  exportCore: true,
  exportModels: true,
  exportServices: true,
  indent: "2",
});

console.log(`OpenAPI client generated: ${output}`);

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

await mkdir(dist, { recursive: true });
await writeFile(join(dist, ".assetsignore"), "_worker.js\n_worker.js/**\n", "utf8");
console.log("Wrote dist/.assetsignore for Wrangler asset upload.");

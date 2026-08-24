import fs from "fs";
import path from "path";
const root = path.dirname(new URL(import.meta.url).pathname);
const names = fs.readdirSync(root).filter((n) => fs.statSync(path.join(root, n)).isDirectory());
for (const name of names) {
  const dir = path.join(root, name);
  const slices = fs.readdirSync(dir).filter((n) => n.endsWith(".hex")).sort();
  const hex = slices.map((n) => fs.readFileSync(path.join(dir, n), "utf8").trim()).join("");
  const buf = Buffer.from(hex, "hex");
  const out = path.join(root, name.replace(/$/, ""));
  fs.writeFileSync(path.join(root, name + ".restored"), buf);
  console.log(name, "bytes", buf.length);
}

import fs from "fs";
import path from "path";
const root = path.dirname(new URL(import.meta.url).pathname);
for (const name of fs.readdirSync(root).filter((n) => fs.statSync(path.join(root, n)).isDirectory())) {
  const dir = path.join(root, name);
  const hex = fs.readdirSync(dir).filter((n) => n.endsWith(".hex")).sort()
    .map((n) => fs.readFileSync(path.join(dir, n), "utf8").trim()).join("");
  fs.writeFileSync(path.join(root, name + ".restored"), Buffer.from(hex, "hex"));
  console.log(name, Buffer.from(hex, "hex").length);
}

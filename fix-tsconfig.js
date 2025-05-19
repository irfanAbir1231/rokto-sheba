const fs = require("fs");
const path = require("path");
const tsconfigPath = path.join(__dirname, "tsconfig.json");

const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
if (tsconfig.include) {
  const before = tsconfig.include.length;
  tsconfig.include = tsconfig.include.filter(
    (item) => item !== ".next/types/**/*.ts"
  );
  if (tsconfig.include.length !== before) {
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");
    console.log("Removed .next/types/**/*.ts from tsconfig.json");
  }
}

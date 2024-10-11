// utils/readSvgFiles.ts
import fs from "fs";
import path from "path";

export const getSvgFileNames = () => {
  const svgDir = path.join(
    process.cwd(),
    "../frontend-nextjs/public/emoji-motion"
  ); // Path to your SVG folder
  const files = fs.readdirSync(svgDir);
  const outputFilePath = path.join(process.cwd(), "./fileName.txt"); // Path for the output file
  // Filter out only .svg files
  const svgFiles = files.filter((file) => path.extname(file) === ".svg");

  fs.writeFileSync(outputFilePath, svgFiles.join("\n"), "utf-8");
  return;
};

getSvgFileNames();

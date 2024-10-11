// utils/getEmojiMotionFiles.ts
import fs from "fs";
import path from "path";

export const getSvgFileNames = (): string[] => {
  const svgDir = path.join(process.cwd(), "public/emoji-motion");
  const files = fs.readdirSync(svgDir);

  // Filter to only include .svg files
  const svgFiles = files.filter((file) => path.extname(file) === ".svg");

  return svgFiles;
};

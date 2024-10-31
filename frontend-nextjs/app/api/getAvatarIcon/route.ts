// pages/api/get-svgs.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { XMLSerializer } from "xmldom";
import { XMLParser } from "fast-xml-parser";
// API to serve multiple SVG files

export function GET(req: Request) {
  const svgDir = path.join(process.cwd(), "public/emoji-motion");

  // Read all files in the directory
  const files = fs.readdirSync(svgDir);

  // Filter for SVG files
  const svgFiles = files.filter((file) => path.extname(file) === ".svg");

  // Read the content of each SVG file
  const svgs = svgFiles.map((fileName) => {
    const filePath = path.join(svgDir, fileName);
    const data = fs.readFileSync(filePath, "utf8");
    const options = {
      ignoreAttributes: false,
    };

    const parser = new XMLParser(options);
    let jsonObj = parser.parse(data);
    jsonObj.svg["@_width"] = "";
    jsonObj.svg["@_height"] = "";
    return { fileName, content: jsonObj };
  });

  // Read the SVG file content

  // Respond with an array of SVG content and file names
  return NextResponse.json({ svgs });
}

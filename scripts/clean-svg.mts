import fs from "node:fs";
import chokidar from "chokidar"
import { JSDOM } from "jsdom"
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    watch:  { type: "boolean", short: "w" },
  },
  allowPositionals: true
});

const inputPath = positionals[0];
if (!inputPath.match(/\.svg$/)) {
  console.error("Usage: args are <file.svg>");
  process.exit(1);
}

const matchAndReplaces: [RegExp, string][] = [
  [/(\s*)inkscape:label="([\w-]+)"/, '$1class="$2"'],
  [/\n\s+(?:id|(?:inkscape|sodipodi|xmlns)[\w\-:]*)="[^"]+"$/, ""],
  [/<sodipodi:namedview[^>]*>$/, ""],
];

if (values.watch) {
  chokidar.watch(inputPath).on("change", run)
}
run();

function run() {
  const before = fs.readFileSync(inputPath, { encoding: 'utf-8' });
  let after = before;

  for (const [match, replace] of matchAndReplaces) {
    console.log("apply", match, replace);
    after = after.replaceAll(new RegExp(match, 'mg'), replace);
  }

  const afterDOM = new JSDOM(after, { contentType: "image/svg+xml" });
  const { document } = afterDOM.window;

  for (const path of document.querySelectorAll("path")) {
    let style = path.getAttribute("style");
    if (style) {
      console.log("path.style", style);
      style = style.replaceAll(/(?:font-size|font-family|-inkscape-font-specification):[^;]+;?/g, "").replace(/stroke-width:0;?/, "");
      if (style === "") {
        path.removeAttribute("style");
      } else {
        path.setAttribute("style", style);
      }
    }
    if (path.classList.contains("glyph-i")) {
      path.setAttribute("pathLength", "1");
    }
  }

  after = afterDOM.serialize();

  if (after !== before) {
    const outputPath = inputPath.replace(/\.svg$/, "-plain.svg");
    fs.writeFileSync(outputPath, after, "utf8");
    console.log(`Transformed: ${outputPath}`);
  } else {
    console.log(`No changes!`);
  }
}

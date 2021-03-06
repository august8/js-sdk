"use strict";

import assert from "assert";
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import rimraf from "rimraf";

import { generatePlugin } from "../src/generator";

describe("generator", function () {
  // This timeout is for npm install
  jest.setTimeout(300000);
  let outputDir: string;
  beforeEach(() => {
    outputDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
    rimraf.sync(outputDir);
  });
  afterEach(() => {
    rimraf.sync(outputDir);
  });
  it("should be able to create a plugin project based on the minimum template", () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "manifest.json"), "utf8")
    );
    generatePlugin(outputDir, manifest, "ja", true);

    // test that `npm run build` doesn't fail
    const buildResult = spawnSync("npm", ["run", "build"], {
      cwd: outputDir,
      stdio: "inherit",
      shell: true
    });
    assert(fs.existsSync(path.resolve(outputDir, "dist", "plugin.zip")));
    assert(buildResult.status === 0);

    assert.deepStrictEqual(
      JSON.parse(
        fs.readFileSync(path.resolve(outputDir, "src", "manifest.json"), "utf8")
      ),
      manifest
    );
    assert.deepStrictEqual(
      fs.readFileSync(
        path.resolve(outputDir, "src", "js", "desktop.js"),
        "utf8"
      ),
      fs.readFileSync(
        path.resolve(
          __dirname,
          "..",
          "templates",
          "minimum",
          "src",
          "js",
          "desktop.js"
        ),
        "utf8"
      )
    );
  });
});

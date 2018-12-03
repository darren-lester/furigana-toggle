const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
const ncp = require("ncp");
const tmp = require("tmp");
const archiver = require("archiver");
const fs = require("fs");

const pkg = require("../package.json");

const SRC_PATH = "src/";
const CHROME_PATH = "dist/chrome";
const FIREFOX_PATH = "dist/firefox";

buildRelease(SRC_PATH, CHROME_PATH, "manifest.json");
buildRelease(SRC_PATH, FIREFOX_PATH, "manifest.firefox.json");

function buildRelease(source, destination, manifest) {
  rimraf.sync(`${destination}/*`);

  mkdirp(destination, error => {
    if (error) {
      return handleError(error);
    }

    const tmpDir = tmp.dirSync();

    ncp(
      source,
      tmpDir.name,
      {
        filter: file => !/manifest.*.json/.test(file)
      },
      error => {
        if (error) {
          return handleError(error);
        }
        ncp(`${source}/${manifest}`, `${tmpDir.name}/manifest.json`, error => {
          if (error) {
            return handleError(error);
          }

          const archive = archiver("zip", {
            zlib: { level: 9 }
          });

          archive.on("error", function(err) {
            throw err;
          });

          const output = fs.createWriteStream(
            `${destination}/furigana-toggle-${pkg.version}.zip`
          );

          archive.pipe(output);
          archive.directory(tmpDir.name, false);
          archive.finalize();
        });
      }
    );
  });
}

function handleError(error) {
  return console.error(error);
}

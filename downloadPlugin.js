const { join } = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
async function downloadPlugin(url, powercord) {
  const themeDir = join(__dirname, "..", "..", "themes");
  const repoName = url.match(/[\w-]+$/)[0];
  let status;
  let c;
  try {
    c = spawn("git", ["clone", url], {
      cwd: themeDir,
      windowsHide: true,
    });
  } catch (e) {
    console.error("Could not install plugin");
  }
  c.stdout.on("data", (data) => console.log(data.toString()));
  c.stderr.on("data", (data) => {
    data = data.toString();
    console.error(data);
    if (data.includes("already exists")) {
        powercord.api.notices.sendToast('PDAlreadyInstalled', {
            header: 'Plugin Already Installed', // required
            content: 'Plugin Already Installed',
            type: 'info',
            timeout: 10e3,
            buttons: [ {
              text: 'Got It', // required
              color: 'green',
              size: 'medium',
              look: 'outlined',
            } ],
          });
    }
  });
  c.on("exit", async (code) => {
    if (code === 0) {
      let files;
      try {
        files = fs.readdirSync(join(themeDir, repoName));
        console.log(files);
      } catch (e) {
        // handle this error eventually, means the folder is nowhere to be found
        console.error(e);
      }
      if (files.includes("manifest.json")) {
        await powercord.themeManager.remount(repoName);
        if (powercord.themeManager.plugins.has(repoName)) {
          powercord.api.notices.sendToast("PDPluginInstalled", {
            header: "Plugin Installed", // required
            content: "Plugin Installed",
            type: "info",
            timeout: 10e3,
            buttons: [
              {
                text: "Got It", // required
                color: "green",
                size: "medium",
                look: "outlined",
              },
            ],
          });
        } else {
          // remount failed, might just force restart
        }
      } else {
        powercord.api.notices.sendToast('PDNoManifest', {
            header: 'This theme has no manifest, it may not be a theme', // required
            content: 'This theme has no manifest, it may not be a theme',
            type: 'info',
            timeout: 10e3,
            buttons: [ {
              text: 'Got It', // required
              color: 'green',
              size: 'medium',
              look: 'outlined',
            } ],
          });
      }
    } else {
      // show the error
    }
  });
}

module.exports = downloadPlugin;

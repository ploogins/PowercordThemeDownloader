const {
  React,
  i18n: { Messages },
} = require("powercord/webpack");
const { Clickable } = require("powercord/components");
const downloadTheme = require("../downloadTheme");
class DownloadButton extends React.Component {
  render() {
    var [GithubLink, , , repoName] = this.props.message.content.match(/https?:\/\/(www.)?git(hub|lab).com\/[\w-]+\/([\w-\._]+)\/?/) ?? [];
    if (!GithubLink) return <></>;
    var installed = powercord.styleManager.isInstalled(repoName);
    if (!this.props.message.content.includes("https://github.com")) {
      return (
        <div
          className={["ThemeDownloaderApply", installed ? "applied" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <Clickable
            onClick={() => {
              if (installed) return;
              downloadTheme(GithubLink, powercord);
            }}
          >
            No Plugin
          </Clickable>
        </div>
      );
    } else {
      return (
        <div
          className={["ThemeDownloaderApply", installed && "applied"]
            .filter(Boolean)
            .join(" ")}
        >
          <Clickable
            onClick={() => {
              if (installed) return;
              downloadTheme(GithubLink, powercord);
            }}
          >
            {installed ? "Theme Installed" : "Download Theme"}
          </Clickable>
        </div>
      );
    }
  }
}

module.exports = DownloadButton;

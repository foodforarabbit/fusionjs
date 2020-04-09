const App = require("@octokit/app");
const Octokit = require("@octokit/rest");

module.exports = {
  create_github_app,
  create_github_user
};

function create_github_app() {
  const app = new App({
    id: process.env.GH_CHECKS_APP_ID,
    privateKey: Buffer.from(
      (process.env.GH_CHECKS_APP_KEY_BASE64 /*: any */),
      "base64"
    ).toString()
  });

  const github_checks = new Octokit({
    async auth() {
      const installationAccessToken = await app.getInstallationAccessToken({
        installationId: process.env.GH_CHECKS_APP_INSTALLATION_ID
      });
      return `token ${installationAccessToken}`;
    }
  });

  return github_checks;
}

function create_github_user() {
  return new Octokit({
    auth: process.env.GH_TOKEN
  });
}

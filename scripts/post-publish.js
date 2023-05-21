const { execSync } = require('child_process');

const version = require('../package.json').version;

const push = async () => {
  const tag = /^[\d.]+$/.test(version);
  execSync(`git add .`);
  execSync(`git commit -m 'build: 🏹 构建并更新版本至 ${version}'`);
  tag && execSync(`git tag v${version}`);
  execSync(`git push --tags`);
};

(async () => {
  await push();
})();

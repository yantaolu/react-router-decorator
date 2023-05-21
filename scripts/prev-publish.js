const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');

const localVersion = pkg.version;

const versions = () => {
  const [major, minor, p] = localVersion.split('.');
  let [patch, b = ''] = p.split('-');

  const alpha = b.startsWith('alpha') ? Number(b.substring(5)) : -1;
  const beta = b.startsWith('beta') ? Number(b.substring(4)) : -1;

  if (alpha === -1 && beta === -1) {
    patch = Number(patch) + 1;
  }

  return [
    [major, minor, patch].join('.'),
    [major, Number(minor) + 1, 0].join('.'),
    [Number(major) + 1, 0, 0].join('.'),
    [major, minor, [patch, `alpha${alpha + 1}`].join('-')].join('.'),
    [major, minor, [patch, `beta${beta + 1}`].join('-')].join('.'),
  ];
};

const updateVersion = async () => {
  const status = execSync('git status').toString();

  // 干净的分区，已无提交
  if (status.includes('无文件要提交，干净的工作区') || status.includes('nothing to commit, working tree clean')) {
  } else {
    console.log(chalk.red('请先提交代码，保持工作区干净'));
    process.exit(1);
  }

  const { version } = await inquirer.prompt({
    type: 'list',
    name: 'version',
    message: `当前版本是 ${chalk.red(localVersion)}, 更新版本至`,
    choices: versions(),
    default: 'patch',
  });

  Object.assign(pkg, { version });

  console.log(chalk.green(version));

  fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(pkg, null, 2) + '\n');
};

(async () => {
  await updateVersion();
})();

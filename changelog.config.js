module.exports = {
  disableEmoji: false,
  format: '{type}{scope}: {emoji}{subject}',
  list: ['feat', 'fix', 'chore', 'release', 'refactor', 'style', 'perf', 'docs', 'ci', 'test'],
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: [
    'type',
    'scope',
    'subject',
    'body',
    // 'breaking', 'issues', 'lerna',
  ],
  scopes: [],
  types: {
    chore: {
      description: '构建过程或辅助工具更改',
      emoji: '🤖',
      value: 'chore',
    },
    ci: {
      description: '持续集成相关修改',
      emoji: '🎡',
      value: 'ci',
    },
    docs: {
      description: '仅文档更改',
      emoji: '✏️',
      value: 'docs',
    },
    feat: {
      description: '增加新的功能点',
      emoji: '🎸',
      value: 'feat',
    },
    fix: {
      description: 'Bug修复',
      emoji: '🐛',
      value: 'fix',
    },
    perf: {
      description: '性能优化',
      emoji: '⚡️',
      value: 'perf',
    },
    refactor: {
      description: '既不修复错误也不增加功能的代码重构',
      emoji: '💡',
      value: 'refactor',
    },
    release: {
      description: '发布版本',
      emoji: '🏹',
      value: 'release',
    },
    style: {
      description: '标记、空白、格式化、缺少分号... 等代码格式化',
      emoji: '💄',
      value: 'style',
    },
    test: {
      description: '补全单元测试',
      emoji: '💍',
      value: 'test',
    },
    messages: {
      type: "Select the type of change that you're committing:",
      customScope: 'Select the scope this component affects:',
      subject: 'Write a short, imperative mood description of the change:\n',
      body: 'Provide a longer description of the change:\n ',
      breaking: 'List any breaking changes:\n',
      footer: 'Issues this commit closes, e.g #123:',
      confirmCommit: 'The packages that this commit has affected\n',
    },
  },
};

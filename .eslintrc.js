// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    "es6": true,
    "jquery": true,
    "amd": true
  },
  globals: {
    vue: true,
    wx: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // add your custom rules here
  'rules': {
    'comma-spacing': [2, {'before': false, 'after': true}], // 逗号后带空格
    'indent': [2, 4], //缩进风格
    'linebreak-style': [2, 'windows'],  // 换行风格
    'quotes': [2, 'single'],  // 引号，单引号
    'semi': [2, 'always'],  // 始终分号结尾
    'no-extra-semi': 2, // 禁止不必要的分号
    'space-before-function-paren': [2, 'never'],  //禁止函数圆括号之前有一个空格

    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-multi-spaces': [2, { ignoreEOLComments: true }]
  }
}

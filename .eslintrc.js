module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "no-multi-str": ["error"],
    "array-bracket-spacing": ["error", "never"],
    "indent": ["error", 2, { SwitchCase: 1, ignoredNodes: ["TemplateLiteral"] }],
    "key-spacing": ["error", { beforeColon: false, afterColon: true}],
    "keyword-spacing": ["error", { before: true, after: true }],
    "semi": ["error", "always"],
    "space-before-blocks": ["error", "always"],
    "space-in-parens": ["error", "never"],
    "no-trailing-spaces": ["error", { skipBlankLines: true }]
  }
};

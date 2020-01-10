module.exports = {
    root: true,
    plugins: [
        'node',
        'mocha'
    ],
    extends: [
        'eslint:recommended',
        'plugin:node/recommended',
        'plugin:mocha/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2016
    },
    env: {
        node: true
    }
};

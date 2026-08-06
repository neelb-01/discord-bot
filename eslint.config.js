const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
        },
        rules: {
            curly: ['error', 'multi-line', 'consistent'],
            'max-nested-callbacks': ['error', { max: 4 }],
            'no-console': 'off',
            'no-empty-function': 'error',
            'no-lonely-if': 'error',
            'no-shadow': ['error', { allow: ['err', 'resolve', 'reject'] }],
            'no-var': 'error',
            'no-undef': 'off',
            'prefer-const': 'error',
            yoda: 'error',
        },
    },
];
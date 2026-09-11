const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    js.configs.recommended,
    {
        ignores: ['node_modules/**', 'logs/**', 'public/**', 'coverage/**', '.env', 'package-lock.json', '.prettierrc', '*.md']
    },
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.browser
            }
        },
        rules: {
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'no-var': 'error',
            'no-console': 'error',
            'comma-dangle': ['error', 'never'],
            indent: ['warn', 4, { SwitchCase: 1 }],
            'no-unused-vars': [
                'warn',
                {
                    args: 'none',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^ignore'
                }
            ],
            camelcase: [
                'error',
                {
                    properties: 'never',
                    ignoreDestructuring: true
                }
            ],
            'id-match': [
                'error',
                '^[a-z][a-zA-Z0-9]*$',
                {
                    onlyDeclarations: true,
                    properties: false,
                    ignoreDestructuring: true
                }
            ],
            'class-methods-use-this': 'warn',
            'new-cap': [
                'error',
                {
                    newIsCap: true,
                    capIsNew: false
                }
            ],
            'brace-style': ['error', '1tbs', { allowSingleLine: true }],
            'space-before-blocks': ['error', 'always'],
            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'never',
                    named: 'never',
                    asyncArrow: 'always'
                }
            ],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'return' },
                { blankLine: 'always', prev: 'if', next: '*' },
                { blankLine: 'always', prev: 'switch', next: '*' },
                { blankLine: 'always', prev: 'for', next: '*' },
                { blankLine: 'always', prev: 'while', next: '*' },
                { blankLine: 'always', prev: 'do', next: '*' },
                { blankLine: 'always', prev: 'try', next: '*' },
                { blankLine: 'always', prev: 'class', next: '*' },
                { blankLine: 'always', prev: 'block', next: '*' },
                { blankLine: 'always', prev: '*', next: 'if' },
                { blankLine: 'always', prev: '*', next: 'switch' },
                { blankLine: 'always', prev: '*', next: 'for' },
                { blankLine: 'always', prev: '*', next: 'while' },
                { blankLine: 'always', prev: '*', next: 'do' },
                { blankLine: 'always', prev: '*', next: 'try' },
                { blankLine: 'always', prev: '*', next: 'class' }
            ],
            'eol-last': ['error', 'always'],
            'comma-spacing': ['error', { before: false, after: true }],
            'template-curly-spacing': ['error'],
            'space-in-parens': ['error', 'never'],
            'semi-spacing': 'error',
            'rest-spread-spacing': ['error', 'never'],
            'padded-blocks': ['error', 'never'],
            'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
            'no-trailing-spaces': ['error', { ignoreComments: true, skipBlankLines: true }],
            'no-self-compare': 'error',
            'no-regex-spaces': 'error',
            'no-multi-spaces': ['error', { exceptions: { VariableDeclarator: true, ImportDeclaration: true } }],
            'no-extra-boolean-cast': 'error',
            'no-duplicate-imports': 'error',
            'key-spacing': 'error',
            'func-call-spacing': ['error', 'never'],
            'dot-location': ['error', 'property'],
            'comma-style': ['error', 'last'],
            'operator-linebreak': ['error', 'after'],
            'block-spacing': 'error',
            curly: 'error',
            'keyword-spacing': ['error', { before: true }],
            'space-infix-ops': 'error',
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'no-useless-escape': 'error',
            eqeqeq: ['error', 'always'],
            'prefer-const': 'error',
            'no-param-reassign': 'warn'
        }
    },
    eslintPluginPrettierRecommended,
    {
        rules: {
            'prettier/prettier': 'off'
        }
    }
];

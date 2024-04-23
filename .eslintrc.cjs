module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    extends: 'love',
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "ignorePatterns": [
        "*.cjs"
    ],
    "rules": {
        "object-curly-spacing": ["error", "always"],
        "@typescript-eslint/semi": "off",
        "semi": ['error', 'always'],
        "no-unexpected-multiline": "error",
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
              "checksVoidReturn": false
            }
        ],
        "indent": ["error", 2]
    }
}

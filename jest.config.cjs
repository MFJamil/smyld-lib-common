module.exports = {
    preset:'ts-jest',
    roots:["<rootDir>/src","<rootDir>/tests"],
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testEnvironment: 'jsdom',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue']
  };
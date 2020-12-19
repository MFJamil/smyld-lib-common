module.exports = {
    roots:["<rootDir>/src","<rootDir>/tests"],
    transform: {"^.+\\.(ts|tsx)$": "ts-jest"},
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = {
  projectRoot,
  watchFolders: [monorepoRoot],
  resolver: {
    resolveRequestParams: {
      root: projectRoot,
    },
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (name[0] === '$') return;
          return path.resolve(projectRoot, 'node_modules', name);
        },
      },
    ),
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);

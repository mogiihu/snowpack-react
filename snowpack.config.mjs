/** @type {import("snowpack").SnowpackUserConfig } */
export default {
    env: {
        ENVIRONMENT: 'test'
    },
    mount: {
        public: '/',
        src: '/src'
    },
    plugins: [
        '@snowpack/plugin-typescript'
        /* ... */
    ],
    routes: [
        /* Enable an SPA Fallback in development: */
        // {"match": "routes", "src": ".*", "dest": "/index.html"},
    ],
    optimize: {
        /* Example: Bundle your final build: */
        // "bundle": true,
    },
    packageOptions: {
        /* ... */
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        out: 'dist'
    },
    alias: {
        // Type 1: node 包 引入别名
        lodash: 'lodash-es',
        // Type 2: 本地文件引入别名
        '@src': './src',
        '@assets': './src/assets',
        '@components': './src/components',
        '@pages': './src/pages',
        '@utils': './src/utils/',
        '@servers': './src/servers',
        '@actions': './src/actions',
        '@config': './src/config.ts',
        '@routeConfig': './src/routeConfig.tsx',
        '@request': './src/request.ts'
    }
};

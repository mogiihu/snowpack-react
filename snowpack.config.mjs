/** @type {import("snowpack").SnowpackUserConfig } */

const getOutPath = () => {
    if (process.env.SNOWPACK_PUBLIC_DOMAIN === 'cloud') return './dist_cloud';
    if (process.env.SNOWPACK_PUBLIC_DOMAIN === 'ikandy') return 'dist';
};

export default {
    mount: {
        public: '/',
        src: '/src'
        // public: path.resolve(__dirname, "./"),
        // src: path.resolve(__dirname, "./src"),
        /* ... */
    },
    alias: {
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
    },
    plugins: ['snowpack-plugin-less', '@snowpack/plugin-typescript'],
    routes: [
        /* Enable an SPA Fallback in development: */
        // {"match": "routes", "src": ".*", "dest": "/index.html"},
    ],
    optimize: {
        /* Example: Bundle your final build: */
        // "bundle": true,
    },
    packageOptions: {
        polyfillNode: true
        /* ... */
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        out: getOutPath()
        /* ... */
    }
};

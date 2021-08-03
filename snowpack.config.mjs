/** @type {import("snowpack").SnowpackUserConfig } */
export default {
    mount: {
        public: '/',
        src: '/src'
        // public: path.resolve(__dirname, "./"),
        // src: path.resolve(__dirname, "./src"),
        /* ... */
    },
    plugins: ['snowpack-plugin-less'],
    routes: [
        /* Enable an SPA Fallback in development: */
        // {"match": "routes", "src": ".*", "dest": "/index.html"},
    ],
    optimize: {
        /* Example: Bundle your final build: */
        // "bundle": true,
    },
    packageOptions: {
        // namedExports: ['antd']
    },
    devOptions: {
        /* ... */
    },
    buildOptions: {
        /* ... */
    }
};

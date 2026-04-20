/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['192.168.10.115'],
    // fhenixjs uses WASM (tfhe-rs). asyncWebAssembly enables webpack to handle it.
    // The turbopack key is intentionally omitted — its presence enables Turbopack,
    // which cannot handle WASM modules. webpack is used for production builds.
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            layers: true,
        };
        // Silence warnings from fhenixjs wasm-bindgen loader
        config.module.rules.push({
            test: /\.wasm$/,
            type: 'webassembly/async',
        });
        return config;
    },
};

export default nextConfig;

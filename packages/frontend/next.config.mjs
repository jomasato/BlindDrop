/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['192.168.10.115'],
    // fhenixjs uses WASM (tfhe-rs) which requires asyncWebAssembly support.
    // Turbopack does not support WASM modules yet, so we fall back to webpack for builds.
    turbopack: {
        resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    },
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


//
const sourceMapsInProduction = true;

//
import autoprefixer from "autoprefixer";
import path from "node:path";
import {defineConfig} from "vite";
import VitePluginBrowserSync from 'vite-plugin-browser-sync';
import prefetchPlugin from 'vite-plugin-bundle-prefetch';
import {compression} from "vite-plugin-compression2";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import {VitePWA} from "vite-plugin-pwa";
import {viteStaticCopy} from "vite-plugin-static-copy";
import certificate from "./https/certificate.mjs";
import pkg from "./package.json" with { type: "json" };
import tsconfig from "./tsconfig.json" with { type: "json" };
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from "vite-plugin-singlefile"
import json5Plugin from 'vite-plugin-json5'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import nodeExternals from 'rollup-plugin-node-externals'
import createExternal from 'vite-plugin-external';

import cssnano from "cssnano";
import deduplicate from "postcss-discard-duplicates";

import postcssPresetEnv from 'postcss-preset-env';

//
const __dirname = import.meta.dirname;

//
const r = (s) => {
    return s;
};

/*process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd())
};*/

const terserOptions = {
    ecma: 2020,
    keep_classnames: false,
    keep_fnames: false,
    module: true,
    toplevel: true,
    mangle: {
        eval: true,
        keep_classnames: false,
        keep_fnames: false,
        module: true,
        toplevel: true,
        properties: {
            builtins: true,
            keep_quoted: "strict",
            undeclared: true,
            only_annotated: true,
            reserved: []
        }
    },
    compress: {
        ecma: 2020,
        keep_classnames: false,
        keep_fnames: false,
        keep_infinity: false,
        reduce_vars: true,
        reduce_funcs: true,
        pure_funcs: [],
        arguments: true,
        expression: true,
        inline: 3,
        module: true,
        passes: 3,
        side_effects: true,
        pure_getters: true,
        typeofs: true,
        toplevel: true,
        unsafe: true,
        unsafe_Function: true,
        unsafe_comps: true,
        unsafe_arrows: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_undefined: true,
        unsafe_methods: true,
        unsafe_regexp: true,
        unsafe_proto: true,
        warnings: true,
        unused: true,
        booleans_as_integers: true,
        hoist_funs: true,
        hoist_vars: true,
        properties: true,
        // don't use in debug mode
        //drop_console: true
    },
    format: {
        braces: false,
        comments: false,
        ecma: 2020,
        //indent_level: 0,
        semicolons: true,
        shebang: true,
        inline_script: true,
        quote_style: 0,
        wrap_iife: true,
        ascii_only: true,
    }
};

//
const production = process.env.NODE_ENV === 'production';
const config = defineConfig({
    root: "./",
    base: './',
    resolve: {
        alias: {
            "vue-i18n": 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
            "vue": 'vue/dist/vue.esm-bundler.js',
            "@node_modules": path.resolve("./node_modules"),
            "@culori": path.resolve("./node_modules/culori"),
            "@material": path.resolve("./node_modules/@material"),
            "happy-opfs": path.resolve("./node_modules/happy-opfs"),

            "@": path.resolve("./"),
            "@src": path.resolve("src/"),
            "@adl": path.resolve("src/"),
            "@assets": path.resolve("assets/")
        },
    },
    plugins: [
        createExternal({
            interop: 'auto',
            externals: {externals: "externals"},
            externalizeDeps: ["externals", "/externals", "./externals"]
        }),
        json5Plugin(),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => [
                        'css-doodle',
                        'u-scrollbox',
                        'u-focustext',
                        'u-longtext'
                    ].includes(tag),
                }
            }
        }),
        VueI18n({
            runtimeOnly: true
        }),
        viteSingleFile({
            useRecommendedBuildConfig: false,
            inlinePattern: ["!(service).mjs"]
        }),
        //analyzer(),
        nodePolyfills(),
        compression({
            algorithm: 'brotliCompress'
        }),
        prefetchPlugin(),
        VitePluginBrowserSync(),
        /*VitePWA({
            injectRegister: null,
            registerType: "autoUpdate",
            devOptions: {
                enabled: true,
                resolveTempFolder: () => {
                    return "./index/temp";
                },
            },
            workbox: {
                clientsClaim: true,
                skipWaiting: true,
            },
        }),*/
        viteStaticCopy({
            targets: [
                /*{
                    src: "./assets/*",
                    dest: "../assets", // 2️⃣
                },*/
                /*{
                    src: "./copying/!(node_modules)",
                    dest: "./", // 2️⃣
                }*/
            ],
        })
    ],
    server: {
        origin: "",
        host: "0.0.0.0",
        port: 443,
        https: {
            ...certificate,
        },
        cors: {
            allowedHeaders: "*",
            preflightContinue: true,
            credentials: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            origin: "*"
        },
        headers: {
            "Content-Security-Policy": "upgrade-insecure-requests",
            "Service-Worker-Allowed": "/",
            "Permissions-Policy": "fullscreen=*, window-management=*",
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Request-Headers": "*"
        }
    },
    esbuild: {
        target: "esnext",
        minifySyntax: true,
        minifyWhitespace: true,
        minifyIdentifiers: true
    },
    build: {
        chunkSizeWarningLimit: 1600,
        assetsInlineLimit: 1024 * 1024,
        minify: false,
        sourcemap: 'hidden',
        target: "esnext",
        name: "app",
        lib: {
            formats: ["es"],
            entry: path.resolve(__dirname, './src/Main.ts'),
            name: "app",
            fileName: "app",
        },
        outDir: "./index",
        emptyOutDir: true,
        rollupOptions: {
            // Add _all_ external dependencies here
            external: ["externals", "/externals", "./externals"],
            output: {
                assetFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                entryFileNames: 'app.js',
            }
        },
    },
    css: {
        postcss: {
            plugins: [autoprefixer(), deduplicate(), cssnano({
                preset: ['default', {
                    calc: false,
                    discardComments: {
                        removeAll: true
                    }
                }],
            }), postcssPresetEnv({ stage: 0 })],
        },
    },
    optimizeDeps: {
        esbuildOptions: {target: "esnext", supported: {bigint: true}},
    },
});

//
export default config;
export {config};

// Load path aliases from the tsconfig.json file
const aliases = tsconfig.compilerOptions.paths;

for (const alias in aliases) {
    const paths = aliases[alias].map((p) => path.resolve(__dirname, p));

    // Our tsconfig uses glob path formats, whereas vite just wants directories
    // We'll need to transform the glob format into a format acceptable to vite

    const viteAlias = alias.replace(/(\\|\/)\*$/, '');
    const vitePaths = paths.map((p) => p.replace(/(\\|\/)\*$/, ''));

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};

    if (config.resolve && config.resolve.alias && !(viteAlias in config.resolve.alias)) {
        config.resolve.alias[viteAlias] = vitePaths.length > 1 ? vitePaths : vitePaths[0];
    }
}


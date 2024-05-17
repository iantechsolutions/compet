/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js')

/** @type {import("next").NextConfig} */

  //CORREGIR CORREGIR CORREGIR TODO PENDIENTE ESTO NO MAL

const config = {
    // Prefer loading of ES Modules over CommonJS
    experimental: { esmExternals: 'loose' }
};

export default config

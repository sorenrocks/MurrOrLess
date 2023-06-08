// @ts-check

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"))

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
}
export default config

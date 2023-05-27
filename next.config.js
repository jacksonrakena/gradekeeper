// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require("@sentry/nextjs");
const withPWA = require("next-pwa");
/**
 * @type {import("next").NextConfig}
 */
const moduleExports = {
  reactStrictMode: true,
  webpack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
};

/**
 * @type {import("@sentry/nextjs").SentryWebpackPluginOptions}
 */
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = require("@next/bundle-analyzer")({ enabled: false })(
  withPWA({
    ...withSentryConfig(moduleExports, sentryWebpackPluginOptions),
    pwa: {
      dest: "public",
      skipWaiting: true,
      disable: process.env.NODE_ENV !== "production",
    },
  })
);

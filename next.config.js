// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require("@sentry/nextjs");
const withPWA = require("next-pwa");

const moduleExports = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
};

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

module.exports = withPWA({
  ...withSentryConfig(moduleExports, sentryWebpackPluginOptions),
  pwa: {
    dest: "public",
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
});

const withPWA = require("next-pwa")({ dest: "public" });

module.exports = withPWA({
  reactStrictMode: true,
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
});

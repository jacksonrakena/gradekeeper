import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jacksonrakena.Gradekeeper",
  appName: "Gradekeeper",
  webDir: "out",
  bundledWebRuntime: false,
  server: {
    url: "https://preview.gradekeeper.xyz",
  },
};

export default config;

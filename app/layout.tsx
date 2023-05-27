import { Metadata } from "next";
import { Providers } from "./providers";

export default function RootLayout(props) {
  return (
    <html lang="en">
      <body>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Gradekeeper",
  description: "Get ahead of your grades with Gradekeeper.",
};

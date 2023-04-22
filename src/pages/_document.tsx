import { CssVarsProvider } from "@mui/joy";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <CssVarsProvider>
        <body>
          <Main />
          <NextScript />
        </body>
      </CssVarsProvider>
    </Html>
  );
}

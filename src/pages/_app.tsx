import type { AppProps } from "next/app";
import { Col, createTheme, NextUIProvider, Row } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";
import { BluePinkBackground } from "components/Backgrounds";
import { NextPage } from "next";

const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {

    },
  },
});
  
const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {

    },
  },
});

export type Page = NextPage & {
  Sidebar?: React.FC<{}>;
}

type AppPageProps = AppProps & {
  Component: Page
}

function MyApp({ Component, pageProps }: AppPageProps) {
  const darkMode = useDarkMode(true);

  return (
    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
      <BluePinkBackground />
      <Row>
        {Component.Sidebar && (
          <Component.Sidebar />
        )}
        <Col>
          <Component {...pageProps} />
        </Col>
      </Row>
    </NextUIProvider>
  );
}

export default MyApp;

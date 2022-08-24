import type { AppProps } from "next/app";
import { Col, createTheme, NextUIProvider, Row } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";
import { BluePinkBackground } from "components/Backgrounds";
import { NextPage } from "next";
import { ReactNode } from "react";
import { trpc } from "utils/trpc";

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
  Wrapper?: React.FC<{ children: ReactNode }>;
}

type AppPageProps = AppProps & {
  Component: Page
}

function MyApp({ Component, pageProps }: AppPageProps) {
  const darkMode = useDarkMode(true);

  const Wrapper = Component.Wrapper ?? (({ children }: { children: ReactNode }) => <>{children}</>);

  return (
    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
      <BluePinkBackground />
      <Wrapper>
        <Row>
          {Component.Sidebar && (
            <Component.Sidebar />
          )}
          <Col>
            <Component {...pageProps} />
          </Col>
        </Row>
      </Wrapper>
    </NextUIProvider>
  );
}

export default trpc.withTRPC(MyApp);

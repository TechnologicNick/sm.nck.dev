import type { AppProps } from "next/app";
import { Col, createTheme, NextUIProvider, Row } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { BluePinkBackground } from "components/Backgrounds";
import { NextPage } from "next";
import { ReactNode } from "react";
import { trpc } from "utils/trpc";
import Navbar from "components/navigation/Navbar";

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

const NoWrapper = ({ children }: { children: ReactNode }) => <>{children}</>;

function MyApp({ Component, pageProps }: AppPageProps) {
  const Wrapper = Component.Wrapper ?? NoWrapper;

  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className
      }}
    >
      <NextUIProvider>
        <BluePinkBackground />
        <Wrapper>
          <Navbar />
          <Row css={{
            ".nextui-button-text": {
              zIndex: "$1" // Fix button text rendering over the navbar collapse content https://github.com/nextui-org/nextui/issues/724
            },
          }}>
            {Component.Sidebar && (
              <Component.Sidebar />
            )}
            <Col>
              <Component {...pageProps} />
            </Col>
          </Row>
        </Wrapper>
      </NextUIProvider>
    </NextThemesProvider>
  );
}

export default trpc.withTRPC(MyApp);

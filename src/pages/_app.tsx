import type { AppProps } from "next/app";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";

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

function MyApp({ Component, pageProps }: AppProps) {
	const darkMode = useDarkMode(true);

  return (
    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;

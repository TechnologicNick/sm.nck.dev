import { Button, Container, Grid, Link, Spacer, Text } from "@nextui-org/react";
import { TbFileDatabase } from "react-icons/tb"
import Head from "next/head";
import NextLink from "next/link";

export const SaveEditorProject = () => {
  return (
    <NextLink href="/save-editor" passHref legacyBehavior>
      <a style={{ width: "100%" }}>
        <Button
          color="gradient"
          size="xl"
          css={{
            w: "100%",
            minWidth: "unset",
          }}
          icon={<TbFileDatabase size={40} />}
          tabIndex={-1}
          role={"none"}
        >
          Save Editor
        </Button>
      </a>
    </NextLink>
  );
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>Scrap Mechanic Projects - nck.dev</title>
        <meta name="description" content="Projects I've made related to the 2016 videogame Scrap Mechanic" />
      </Head>
      <Container sm display="flex" justify="center" alignItems="center" direction="column" css={{ pt: "$10" }}>
        <Text h1>
          Scrap Mechanic Projects
        </Text>
        <Text>
          Projects I've made related to the 2016 videogame {}
          <Link href="https://store.steampowered.com/app/387990/Scrap_Mechanic/" target="_blank" css={{ display: "inline" }}>
            Scrap Mechanic
          </Link>
        </Text>
        <Spacer />
        <Grid.Container gap={2} justify="center">
          <Grid xs={12} md={6}>
            <SaveEditorProject />
          </Grid>
        </Grid.Container>
      </Container>
    </div>
  )
}

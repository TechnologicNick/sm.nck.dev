import { Button, Container, Grid, Link, Spacer, Text } from "@nextui-org/react";
import { TbFileDatabase } from "react-icons/tb"
import Head from "next/head";
import NextLink from "next/link";

export const SaveEditorProject = () => {
  return (
    <NextLink href="/save-editor" passHref legacyBehavior>
      <Button
        as="a"
        color="gradient"
        size="xl"
        css={{ w: "100%" }}
        icon={<TbFileDatabase size={40} />}
      >
        Save Editor
      </Button>
    </NextLink>
  );
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>Scrap Mechanic Projects - nck.dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container sm display="flex" justify="center" direction="column" css={{ pt: "$10" }}>
        <Text h1>
          Scrap Mechanic Projects
        </Text>
        <Text>
          Projects I've made related to the 2016 videogame {}
          <Link href="https://store.steampowered.com/app/387990/Scrap_Mechanic/" target="_blank">
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

import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Spacer } from "@nextui-org/spacer";
import { Metadata } from "next";
import { TbFileDatabase } from "react-icons/tb";

export const metadata: Metadata = {
  title: "Scrap Mechanic Projects - nck.dev",
  description: "Projects I've made related to the 2016 videogame Scrap Mechanic",
}

const SaveEditorProject = () => {
  return (
    <Button
      href="/save-editor"
      as={Link}
      size="lg"
      startContent={<TbFileDatabase size={40} />}
      className="dark w-full bg-[linear-gradient(69deg,#d946ef,#ec4899_90%)]"
    >
      Save Editor
    </Button>
  );
};

export default function HomePage() {
  return (
    <main className="container mx-auto max-w-3xl pt-16 px-6 flex-grow flex flex-col items-center justify-center text-center">
      <h1 className="font-bold text-5xl mb-4">Scrap Mechanic Projects</h1>
      <p>
        Projects I've made related to the 2016 videogame {}
        <Link
          href="https://store.steampowered.com/app/387990/Scrap_Mechanic/"
          isExternal
          showAnchorIcon
        >
          Scrap Mechanic
        </Link>
      </p>
      <Spacer y={8}/>
      <SaveEditorProject />
      <Spacer y={8}/>
    </main>
  );
}

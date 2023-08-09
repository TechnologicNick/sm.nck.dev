import { Container, Loading, Row, Text } from "@nextui-org/react";
import { useState } from "react";
import { FieldProps, UuidField } from ".";
import Uuid from "@/save-editor/structures/uuid";
import { trpc } from "utils/trpc";
import { GameMode, LocalId } from "projects/content-database/types";
import Stack from "components/Stack";
import Image from "next/image";
import Div from "components/Div";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export interface ItemStackUuidFieldProps extends FieldProps<Uuid> {
  allowUnsafe?: boolean;
  mods: LocalId[];
  gameMode?: GameMode;
}

const ItemStackUuidField = ({ label, initialValue, onChange, errorText, fieldRef, allowUnsafe, mods, gameMode }: ItemStackUuidFieldProps) => {
  const [uuid, setUuid] = useState(initialValue ?? Uuid.NIL);

  const onUuidChange = (uuid: Uuid | undefined) => {
    onChange(uuid);
    uuid && setUuid(uuid);
  }

  const isNil = uuid.isNil();

  const [hideIcon, setHideIcon] = useState(false);
  const [iconLoading, setIconLoading] = useState(false);

  const info = trpc.contentDatabase.items.info.useQuery({
    uuid: uuid.toString(),
    mods,
    gameMode,
  }, {
    enabled: !isNil,
    staleTime: Infinity,
  });

  let origin = "???";
  if (info.data) {
    if ("ugc" in info.data.origin) {
      origin = `${info.data.origin.ugc.type} - ${info.data.origin.ugc.name}`;
    } else if ("vanilla" in info.data.origin) {
      origin = `Vanilla - ${capitalizeFirstLetter(info.data.origin.vanilla.gameMode)} Mode`;
    } else {
      origin = "Unknown Origin";
    }
  }

  return (<>
    <Container fluid>
      <Row align="center" css={{
        gap: "$lg",
      }}>
        <Div css={{
          padding: "$sm",
          background: "transparent",
          borderRadius: "$2xl",
          boxShadow: "0 0 0 $borderWeights$normal $colors$border",
          display: "grid",
          placeItems: "center",
        }}>
          <Stack streched css={{
            $$minHeight: "96px",
            minWidth: "96px",
          }}>
            {(info.isLoading || iconLoading) && (
              <Loading size="xl" />
            )}
            {info.data && (
              <Image
                unoptimized
                src={info.data.icon}
                alt={(info.data && info.data.inventoryDescription.title) ? `Icon of ${info.data.inventoryDescription.title}` : "Icon"}
                width={96}
                height={96}
                style={{
                  objectFit: "contain",
                  display: hideIcon ? "none" : "block",
                }}
                onLoadStart={() => setIconLoading(true)}
                onLoadingComplete={() => {
                  setHideIcon(false);
                  setIconLoading(false);
                }}
                onError={() => {
                  setHideIcon(true);
                  setIconLoading(false);
                }}
              />
            )}
          </Stack>
        </Div>
        <Div css={{
          display: "flex",
          flexDirection: "column",
          gap: "$xs",
          lineHeight: "normal",
        }}>
          <Text css={{ lineHeight: "normal" }}>{(info.data && info.data.inventoryDescription.title) ?? "???"}</Text>
          <Text small color="$accents7" css={{ lineHeight: "normal" }}>{origin}</Text>
        </Div>
      </Row>
    </Container>
    <UuidField
      label={label}
      initialValue={initialValue}
      onChange={onUuidChange}
      errorText={errorText}
      fieldRef={fieldRef}
      allowUnsafe={allowUnsafe}
    />
  </>);
}

export default ItemStackUuidField;

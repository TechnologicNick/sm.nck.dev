import { Link, Loading, User } from "@nextui-org/react"
import { useWorkshopDetails } from "@/save-editor/hooks";

export interface SteamProfileCellProps {
  fileId: bigint | string;
  cacheMissing?: boolean;
}

const SteamWorkshopCell = ({ fileId, cacheMissing = false }: SteamProfileCellProps) => {
  const details = useWorkshopDetails(fileId, cacheMissing);

  const userCss: React.ComponentProps<typeof User>["css"] = {
    ".nextui-user-avatar": {
      aspectRatio: 16 / 9,
      width: "unset",
      "--nextui-radii-squared": `${36 * 0.33}px`,
    }
  };

  if (details === "loading") {
    return <Loading />
  } else if (details === "error") {
    return (
      <User
        name="Workshop item not found"
        text="?"
        squared
        bordered
        size="xl"
        css={userCss}
      />
    )
  }

  return (
    <User
      name={details.title}
      src={details.previewUrl}
      squared
      bordered
      size="xl"
      css={userCss}
    >
      <Link href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${fileId}`} target="_blank" css={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        display: "inline-block",
        lineHeight: "1em"
      }}>
        View on steamcommunity.com
      </Link>
      {" | "}
      <Link href={`steam://openurl/https://steamcommunity.com/sharedfiles/filedetails/?id=${fileId}`} css={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        display: "inline-block",
        lineHeight: "1em"
      }}>
        View in Steam
      </Link>
    </User>
  )
}

export default SteamWorkshopCell;

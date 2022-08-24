import { Link, Loading, Text, User } from "@nextui-org/react"
import { useWorkshopDetails } from "@/save-editor/hooks";

export interface SteamProfileCellProps {
  fileId: bigint | string;
  cacheMissing?: boolean;
  compact?: boolean;
}

const SteamWorkshopCell = ({ fileId, cacheMissing = false, compact = false }: SteamProfileCellProps) => {
  const details = useWorkshopDetails(fileId, cacheMissing);

  const userCss: React.ComponentProps<typeof User>["css"] = {
    ".nextui-user-avatar": {
      ".nextui-avatar-img": {
        aspectRatio: 16 / 9,
      },
      width: "unset",
      minWidth: `${60 * 16 / 9}px`,
      "--nextui-radii-squared": `${36 * 0.33}px`,
    }
  };

  if (details === "loading") {
    return <Loading size="xl" />
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

  const linkCss: React.ComponentProps<typeof Link>["css"] = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    display: "inline-block",
    lineHeight: "1em"
  }

  return (
    <User
      name={details.title || "(Untitled)"}
      src={details.previewUrl}
      squared
      bordered
      size="xl"
      css={userCss}
    >
      <Link href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${fileId}`} target="_blank" css={linkCss}>
        {compact ? "steamcommunity.com" : "View on steamcommunity.com"}
      </Link>
      {" | "}
      <Link href={`steam://openurl/https://steamcommunity.com/sharedfiles/filedetails/?id=${fileId}`} css={linkCss}>
        {compact ? "Steam" : "View in Steam"}
      </Link>
    </User>
  )
}

export default SteamWorkshopCell;

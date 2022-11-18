import { Link, Loading, User } from "@nextui-org/react"
import { usePlayerSummary } from "@/save-editor/hooks";

export interface SteamProfileCellProps {
  steamId64: bigint | string;
  cacheMissing?: boolean;
}

const SteamProfileCell = ({ steamId64, cacheMissing = false }: SteamProfileCellProps) => {
  const summary = usePlayerSummary(steamId64, cacheMissing);

  const userCss: React.ComponentProps<typeof User>["css"] = {
    ".nextui-user-name": {
      textTransform: "none",
    },
  };

  if (summary === "loading") {
    return <Loading />
  } else if (summary === "error") {
    return (
      <User
        name="Player not found"
        text="?"
        squared
        bordered
        css={userCss}
      />
    )
  }

  return (
    <User
      name={summary.personaName}
      src={summary.avatarMedium}
      squared
      bordered
      css={userCss}
    >
      <Link href={summary.profileUrl} target="_blank" css={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        display: "inline-block",
        lineHeight: "1em"
      }}>
        {summary.profileUrl}
      </Link>
    </User>
  )
}

export default SteamProfileCell;

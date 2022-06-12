import { Link, Loading, User } from "@nextui-org/react"
import usePlayerSummary from "../../../hooks/use-player-summary";

export interface SteamProfileCellProps {
  steamId64: bigint | string;
  cacheMissing?: boolean;
}

const SteamProfileCell = ({ steamId64, cacheMissing = false }: SteamProfileCellProps) => {
  const summary = usePlayerSummary(steamId64, cacheMissing);

  if (summary === "loading") {
    return <Loading />
  } else if (summary === "error") {
    return (
      <User
        name="Player not found"
        text="?"
        squared
        bordered
      />
    )
  }

  return (
    <User
      name={summary.personaName}
      src={summary.avatarMedium}
      squared
      bordered
    >
      <Link href={summary.profileUrl} css={{
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

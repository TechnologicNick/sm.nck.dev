import { Link, Loading, User } from "@nextui-org/react"
import usePlayerSummary from "../../../hooks/use-player-summary";

export interface SteamProfileCellProps {
  steamId64: bigint | string;
}

const SteamProfileCell = ({ steamId64 }: SteamProfileCellProps) => {
  const summary = usePlayerSummary(steamId64);

  if (!summary) {
    return <Loading />
  }

  return (
    <User
      name={summary.personaName}
      src={summary.avatarMedium}
      squared
      bordered
    >
      <Link href={summary.profileUrl}>
        {summary.profileUrl}
      </Link>
    </User>
  )
}

export default SteamProfileCell;

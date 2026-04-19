import { Link } from 'react-router-dom'
import { useAuth } from '../../context/auth.context'

export type RoomPreJoinLobbyHeaderProps = {
  roomId: string | undefined
}

export function RoomPreJoinLobbyHeader({ roomId }: RoomPreJoinLobbyHeaderProps) {
  const { user } = useAuth()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-0.5 max-lg:gap-2 lg:gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-400">Join meeting</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
          {roomId ? `Room: ${roomId}` : 'Room'}
        </h1>
        {user?.username ? <p className="mt-1 text-sm text-slate-400">Signed in as {user.username}</p> : null}
      </div>
      <Link
        to="/"
        className="rounded-md border border-slate-700/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-800 max-lg:shrink-0 lg:rounded-lg lg:border-slate-700 lg:px-4 lg:py-2 lg:text-sm"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

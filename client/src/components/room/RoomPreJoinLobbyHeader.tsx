import { Link } from 'react-router-dom'
import { useAuth } from '../../context/auth.context'

export type RoomPreJoinLobbyHeaderProps = {
  roomId: string | undefined
}

export function RoomPreJoinLobbyHeader({ roomId }: RoomPreJoinLobbyHeaderProps) {
  const { user } = useAuth()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-400">Join meeting</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">
          {roomId ? `Room: ${roomId}` : 'Room'}
        </h1>
        {user?.username ? <p className="mt-1 text-sm text-slate-400">Signed in as {user.username}</p> : null}
      </div>
      <Link
        to="/"
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

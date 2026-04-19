import { CameraIcon, MicIcon } from './CallControlIcons'
import { RoomPreJoinLobbyHeader } from './RoomPreJoinLobbyHeader'

export type RoomPreJoinLobbyProps = {
  roomId: string | undefined
  myStream: MediaStream | null
  mediaError: string | null
  isMicOn: boolean
  isCameraOn: boolean
  handleMicToggle: () => void
  handleCameraToggle: () => void
  onReadyToJoin: () => void
}

export function RoomPreJoinLobby({
  roomId,
  myStream,
  mediaError,
  isMicOn,
  isCameraOn,
  handleMicToggle,
  handleCameraToggle,
  onReadyToJoin,
}: RoomPreJoinLobbyProps) {
  const userMediaAccessible = Boolean(myStream)

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-0.5rem)] w-full max-w-3xl flex-col gap-4 py-3 max-lg:px-0 sm:gap-6 sm:py-6 lg:min-h-[calc(100vh-2rem)] lg:gap-8 lg:py-8">
      <RoomPreJoinLobbyHeader roomId={roomId} />

      <div className="overflow-hidden rounded-xl border border-slate-800/70 bg-slate-900/70 shadow-lg shadow-black/20 lg:rounded-2xl lg:border-slate-800 lg:shadow-xl lg:shadow-black/30">
        <div className="relative aspect-video w-full bg-slate-950">
          {isCameraOn && myStream ? (
            <video
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
              ref={(video) => {
                if (video) video.srcObject = myStream
              }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
              <p className="text-sm text-slate-400">
                {!userMediaAccessible && !mediaError
                  ? 'Requesting camera and microphone…'
                  : !isCameraOn && isMicOn
                    ? 'Camera off — microphone on'
                    : 'Camera preview'}
              </p>
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleMicToggle}
              aria-label={isMicOn ? 'Turn microphone off' : 'Turn microphone on'}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                isMicOn
                  ? 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                  : 'bg-red-500/25 text-red-200 hover:bg-red-500/35'
              }`}
            >
              <MicIcon muted={!isMicOn} />
            </button>
            <button
              type="button"
              onClick={handleCameraToggle}
              aria-label={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                isCameraOn
                  ? 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                  : 'bg-red-500/25 text-red-200 hover:bg-red-500/35'
              }`}
            >
              <CameraIcon off={!isCameraOn} />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800/80 p-3 max-lg:border-slate-800/60 lg:p-6">
          {mediaError ? (
            <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
              {mediaError}. Allow access in your browser settings to continue.
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              {userMediaAccessible
                ? 'When you are ready, join the room. Others will see you after you enter.'
                : 'Allow camera and microphone to join.'}
            </p>
            <button
              type="button"
              onClick={onReadyToJoin}
              disabled={!userMediaAccessible}
              className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ready to join
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

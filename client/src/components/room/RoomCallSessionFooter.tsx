import { CameraIcon, MicIcon } from './CallControlIcons'

export type RoomCallSessionFooterProps = {
  isMicOn: boolean
  isCameraOn: boolean
  handleMicToggle: () => void
  handleCameraToggle: () => void
  isScreenSharing: boolean
  onScreenShareClick: () => void
  onLeaveClick: () => void
}

export function RoomCallSessionFooter({
  isMicOn,
  isCameraOn,
  handleMicToggle,
  handleCameraToggle,
  isScreenSharing,
  onScreenShareClick,
  onLeaveClick,
}: RoomCallSessionFooterProps) {
  return (
    <footer className="rounded-xl border border-slate-800/70 bg-slate-900/70 px-2 py-2 max-lg:shadow-sm lg:rounded-2xl lg:border-slate-800 lg:px-4 lg:py-3">
      <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3">
        <button
          type="button"
          onClick={handleMicToggle}
          aria-label={isMicOn ? 'Turn microphone off' : 'Turn microphone on'}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition max-lg:text-[13px] lg:px-4 lg:py-2 ${
            isMicOn
              ? 'bg-slate-800 text-slate-100 hover:bg-slate-700'
              : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
          }`}
        >
          <MicIcon muted={!isMicOn} />
        </button>

        <button
          type="button"
          onClick={handleCameraToggle}
          aria-label={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition max-lg:text-[13px] lg:px-4 lg:py-2 ${
            isCameraOn
              ? 'bg-slate-800 text-slate-100 hover:bg-slate-700'
              : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
          }`}
        >
          <CameraIcon off={!isCameraOn} />
        </button>

        <button
          type="button"
          onClick={onScreenShareClick}
          aria-label={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition max-lg:text-[13px] lg:px-4 lg:py-2 ${
            isScreenSharing
              ? 'bg-amber-500/25 text-amber-200 hover:bg-amber-500/35'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
          }`}
        >
          {isScreenSharing ? 'Stop sharing' : 'Share screen'}
        </button>

        <button
          type="button"
          onClick={onLeaveClick}
          aria-label="Leave call"
          className="rounded-full bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/30 max-lg:text-[13px] lg:px-4 lg:py-2"
        >
          Leave
        </button>
      </div>
    </footer>
  )
}

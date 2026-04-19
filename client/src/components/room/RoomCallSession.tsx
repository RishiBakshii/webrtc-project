import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/auth.context'
import type { RoomChatMessage } from '../../hooks/useRoomChat'
import { ChatSidebarContent } from './ChatSidebarContent'
import { MicIcon } from './CallControlIcons'
import { RoomCallSessionFooter } from './RoomCallSessionFooter'

type RemoteUser = { userId: string; username: string; email: string }

export type RoomCallSessionProps = {
  roomId: string | undefined
  isRemoteMicEnabled: boolean
  isRemoteCameraEnabled: boolean
  remoteAudioStream: MediaStream | null
  remoteVideoStream: MediaStream | null
  remoteScreenShareStream: MediaStream | null
  remoteUser: RemoteUser | null
  remoteStream: MediaStream | null
  remoteSocketId: string | null
  hasLiveRemoteVideo: boolean
  myStream: MediaStream | null
  isMicOn: boolean
  isCameraOn: boolean
  handleMicToggle: () => void
  handleCameraToggle: () => void
  isScreenSharing: boolean
  onScreenShareClick: () => void
  onLeaveClick: () => void
  messages: RoomChatMessage[]
  chatInput: string
  setChatInput: (value: string) => void
  handleChatSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function isRemoteMicLive(remoteAudioStream: MediaStream | null) {
  return Boolean(
    remoteAudioStream?.getAudioTracks().some((t) => t.enabled && t.readyState === 'live'),
  )
}

/** First letter for Meet-style avatar tiles (username, else email local-part). */
function userInitial(username: string | undefined, email: string | undefined) {
  const name = username?.trim()
  if (name) return name.charAt(0).toUpperCase()
  const em = email?.trim()
  if (em) {
    const local = em.split('@')[0]
    if (local) return local.charAt(0).toUpperCase()
  }
  return '?'
}

export function RoomCallSession({
  roomId,
  isRemoteMicEnabled: _isRemoteMicEnabled,
  isRemoteCameraEnabled: _isRemoteCameraEnabled,
  remoteAudioStream,
  remoteVideoStream,
  remoteScreenShareStream,
  remoteUser,
  remoteStream: _remoteStream,
  remoteSocketId,
  hasLiveRemoteVideo,
  myStream,
  isMicOn,
  isCameraOn,
  handleMicToggle,
  handleCameraToggle,
  isScreenSharing,
  onScreenShareClick,
  onLeaveClick,
  messages,
  chatInput,
  setChatInput,
  handleChatSubmit,
}: RoomCallSessionProps) {
  const { user } = useAuth()
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false)

  useEffect(() => {
    if (!isMobileChatOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileChatOpen])

  useEffect(() => {
    if (!isMobileChatOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileChatOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMobileChatOpen])

  const remoteMicLive = isRemoteMicLive(remoteAudioStream)
  const localInitial = userInitial(user?.username, user?.email)

  return (
    <div className="flex h-[calc(100dvh-0.5rem)] w-full max-lg:gap-1.5 lg:h-[calc(100vh-2rem)] lg:gap-4">
      <section className="flex min-w-0 flex-1 flex-col gap-1.5 lg:gap-4">
        <header className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800/70 bg-slate-900/70 px-2.5 py-2 max-lg:shadow-sm lg:gap-3 lg:rounded-2xl lg:border-slate-800 lg:px-4 lg:py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-400">Room</p>
            <h1 className="text-lg font-semibold">{roomId}</h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsMobileChatOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700/80 bg-slate-950/80 px-2 py-1 text-[11px] font-medium text-slate-200 transition hover:bg-slate-800 lg:hidden"
              aria-expanded={isMobileChatOpen}
              aria-controls="mobile-chat-drawer"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chat
            </button>
            <Link
              to="/"
              className="rounded-md border border-slate-700/80 px-2 py-1 text-[11px] font-medium text-slate-200 transition hover:bg-slate-800 max-lg:shrink-0 lg:rounded-lg lg:border-slate-700 lg:px-3 lg:py-1.5 lg:text-xs"
            >
              Back to dashboard
            </Link>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-800/60 bg-slate-900/70 p-1 lg:rounded-2xl lg:border-slate-800 lg:p-3">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
            {remoteScreenShareStream ? (
              <div className="relative min-h-0 w-full max-h-[42dvh] shrink-0 overflow-hidden rounded-md border border-cyan-500/35 bg-black lg:max-h-[45vh] lg:rounded-xl">
                <div className="pointer-events-none absolute left-2 top-2 z-10 rounded-md border border-cyan-500/30 bg-slate-950/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-200/90">
                  Their screen
                </div>
                <video
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                  ref={(video) => {
                    if (video) video.srcObject = remoteScreenShareStream
                  }}
                />
              </div>
            ) : null}

            <div
              className={`grid min-h-0 min-w-0 flex-1 gap-2 ${
                remoteScreenShareStream
                  ? 'grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1'
                  : 'grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1'
              }`}
            >
              {/* Remote participant */}
              <div className="relative flex min-h-[min(200px,32dvh)] min-w-0 flex-col overflow-hidden rounded-md border border-slate-700/80 bg-slate-950 sm:min-h-0 lg:rounded-xl">
                {!remoteSocketId ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-8">
                    <p className="text-center text-sm text-slate-500">Waiting for other person...</p>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
                    </div>
                  </div>
                ) : (
                  <>
                    {hasLiveRemoteVideo && remoteVideoStream ? (
                      <video
                        autoPlay
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover"
                        ref={(video) => {
                          if (video) video.srcObject = remoteVideoStream
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                        <div
                          className="flex aspect-square w-[min(42%,7.5rem)] max-w-30 items-center justify-center rounded-full border border-slate-600/50 bg-slate-800/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                          aria-hidden
                        >
                          <span className="text-[clamp(1.75rem,10vmin,2.75rem)] font-semibold leading-none tracking-tight text-white">
                            {(remoteUser?.username?.trim()?.charAt(0) || '?').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {remoteSocketId ? (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent px-2 pb-2 pt-10">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-medium text-slate-100">
                        {remoteUser?.username ?? 'Guest'}
                      </span>
                      <span className={remoteMicLive ? 'text-slate-200' : 'text-red-400'}>
                        <MicIcon muted={!remoteMicLive} />
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Local participant */}
              <div className="relative flex min-h-[min(200px,32dvh)] min-w-0 flex-col overflow-hidden rounded-md border border-slate-700/80 bg-slate-950 sm:min-h-0 lg:rounded-xl">
                {isCameraOn && myStream ? (
                  <video
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    ref={(video) => {
                      if (video) video.srcObject = myStream
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                    <div
                      className="flex aspect-square w-[min(42%,7.5rem)] max-w-30 items-center justify-center rounded-full border border-slate-600/50 bg-slate-800/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      aria-hidden
                    >
                      <span className="text-[clamp(1.75rem,10vmin,2.75rem)] font-semibold leading-none tracking-tight text-white">
                        {localInitial}
                      </span>
                    </div>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/80 via-black/40 to-transparent px-2 pb-2 pt-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-slate-100">You</span>
                    <span className={isMicOn ? 'text-slate-200' : 'text-red-400'}>
                      <MicIcon muted={!isMicOn} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <audio
            autoPlay
            ref={(audio) => {
              if (audio) audio.srcObject = remoteAudioStream
            }}
          />
        </div>

        <RoomCallSessionFooter
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          handleMicToggle={handleMicToggle}
          handleCameraToggle={handleCameraToggle}
          isScreenSharing={isScreenSharing}
          onScreenShareClick={onScreenShareClick}
          onLeaveClick={onLeaveClick}
        />
      </section>

      <aside className="hidden w-[330px] shrink-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-4 lg:flex">
        <ChatSidebarContent
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleChatSubmit={handleChatSubmit}
          userId={user?.id}
          variant="docked"
        />
      </aside>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-out lg:hidden ${
          isMobileChatOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isMobileChatOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/60"
          aria-label="Close chat"
          onClick={() => setIsMobileChatOpen(false)}
        />
      </div>

      <aside
        id="mobile-chat-drawer"
        className={`fixed inset-y-0 right-0 z-50 flex min-h-0 w-full max-w-full flex-col border-l border-slate-800/60 bg-slate-900 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] shadow-2xl shadow-black/50 transition-transform duration-300 ease-out sm:max-w-sm sm:border-slate-800 lg:hidden ${
          isMobileChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMobileChatOpen}
      >
        <ChatSidebarContent
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleChatSubmit={handleChatSubmit}
          userId={user?.id}
          variant="drawer"
          onClose={() => setIsMobileChatOpen(false)}
        />
      </aside>
    </div>
  )
}

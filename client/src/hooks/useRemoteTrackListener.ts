import { useCallback, useEffect, useState } from 'react'
import { peer } from '../lib/webrtc/peer'

type UseRemoteTrackListenerParams = {
  /** When set, re-bind listeners after RTCPeerConnection exists (e.g. joiner after offer). */
  remoteSocketId: string | null
}

export const useRemoteTrackListener = ({ remoteSocketId }: UseRemoteTrackListenerParams) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [remoteAudioStream, setRemoteAudioStream] = useState<MediaStream | null>(null)
  const [remoteVideoStream, setRemoteVideoStream] = useState<MediaStream | null>(null)

  const handleRemoteStream = useCallback((event: RTCTrackEvent) => {
    const incomingRemoteStream = event.streams[0]
    if (!incomingRemoteStream) return

    setRemoteStream(incomingRemoteStream)

    const audioTrack = incomingRemoteStream.getAudioTracks()[0]
    const videoTrack = incomingRemoteStream.getVideoTracks()[0]

    console.log('received audio track', audioTrack)
    console.log('received video track', videoTrack)

    const receivedAudioStream = audioTrack ? new MediaStream([audioTrack]) : null
    const receivedVideoStream = videoTrack ? new MediaStream([videoTrack]) : null

    setRemoteAudioStream(receivedAudioStream)
    setRemoteVideoStream(receivedVideoStream)
  }, [])

  useEffect(() => {
    peer.peer?.addEventListener('track', handleRemoteStream)
    return () => {
      peer.peer?.removeEventListener('track', handleRemoteStream)
    }
  }, [handleRemoteStream, remoteSocketId])

  return { remoteStream, remoteAudioStream, remoteVideoStream }
}

import { useEffect } from 'react'
import type { Socket } from 'socket.io-client'
import { peer } from '../lib/webrtc/peer'
import { SOCKET_EVENTS } from '../socket/events'
import toast from 'react-hot-toast'

type WebRtcIceCandidatePayload = {
  roomId: string
  fromSocketId: string
  fromUser: { userId: string; username: string; email: string }
  candidate: RTCIceCandidateInit
}

export const useWebRtcIceCandidate = (socket: Socket | null) => {
  
  useEffect(() => {
    if (!socket) return

    const handleWebRtcIceCandidate = (payload: WebRtcIceCandidatePayload) => {
      void (async () => {
        console.log('Remote WEBRTC_ICE_CANDIDATE received:', payload)
        await peer.peer?.addIceCandidate(new RTCIceCandidate(payload.candidate))
        toast.success(`Remote ICE candidate received from ${payload.fromUser.username}`)
      })()
    }

    socket.on(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, handleWebRtcIceCandidate)

    return () => {
      socket.off(SOCKET_EVENTS.WEBRTC_ICE_CANDIDATE, handleWebRtcIceCandidate)
    }
  }, [socket])
}

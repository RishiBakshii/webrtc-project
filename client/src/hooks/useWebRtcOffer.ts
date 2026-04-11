import { useEffect } from 'react'
import type { Socket } from 'socket.io-client'
import toast from 'react-hot-toast'
import { peer } from '../lib/webrtc/peer'
import { SOCKET_EVENTS } from '../socket/events'

type WebRtcOfferPayload = {
  roomId: string
  fromSocketId: string
  fromUser: { userId: string; username: string; email: string }
  offer: unknown
}

type RemoteUser = { userId: string; username: string; email: string }

export const useWebRtcOffer = (
  socket: Socket | null,
  myStream: MediaStream | null,
  setRemoteSocketId: (id: string) => void,
  setRemoteUser: (user: RemoteUser) => void,
) => {
  useEffect(() => {
    if (!socket) return

    const handleWebRtcOffer = (payload: WebRtcOfferPayload) => {
      // Joiner never receives OTHER_PERSON_JOINED; the offer carries the offerer's socket id for ICE + UI.
      setRemoteSocketId(payload.fromSocketId)
      setRemoteUser(payload.fromUser)

      void (async () => {
        console.log('Remote WEBRTC_OFFER received:', payload)
        toast.success(`Remote offer received from ${payload.fromUser.username}`)

        if (!myStream) {
          toast.error('Local camera and microphone are not ready.')
          return
        }

        await peer.attachLocalStream(myStream)

        const answer = await peer.getAnswer(payload.offer as RTCSessionDescriptionInit)
        if (!answer) {
          toast.error('Failed to create WebRTC answer')
          return
        }

        socket.emit(SOCKET_EVENTS.WEBRTC_ANSWER, {
          roomId: payload.roomId,
          toSocketId: payload.fromSocketId,
          answer,
        })
        toast.success(`You have sent your answer to ${payload.fromUser.username} successfully`)
      })()
    }

    socket.on(SOCKET_EVENTS.WEBRTC_OFFER, handleWebRtcOffer)

    return () => {
      socket.off(SOCKET_EVENTS.WEBRTC_OFFER, handleWebRtcOffer)
    }
  }, [socket, myStream, setRemoteSocketId, setRemoteUser])
}

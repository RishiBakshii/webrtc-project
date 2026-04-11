import { useEffect } from 'react'
import toast from 'react-hot-toast'
import type { Socket } from 'socket.io-client'
import { peer } from '../lib/webrtc/peer'
import { SOCKET_EVENTS } from '../socket/events'

type OtherPersonJoinedPayload = {
  roomId: string
  joinedSocketId: string
  user: { userId: string; username: string; email: string }
}

export const useOtherPersonJoined = (
  socket: Socket | null,
  setRemoteSocketId: (socketId: string) => void,
  setRemoteUser: (user: { userId: string; username: string; email: string }) => void,
  myStream: MediaStream | null,
) => {
  useEffect(() => {
    if (!socket) return

    const handleOtherPersonJoined = (payload: OtherPersonJoinedPayload) => {
      toast.success(`${payload.user.username} joined room ${payload.roomId}`)
      setRemoteSocketId(payload.joinedSocketId)
      setRemoteUser(payload.user)

      if (!myStream) {
        toast.error('Local camera and microphone are not ready yet.')
        toast.error("Sending you back to lobby screen, please reload the page")
        return
      }

      void (async () => {
        await peer.attachLocalStream(myStream)

        const offer = await peer.getOffer()
        if (!offer) {
          toast.error('Failed to create WebRTC offer')
          return
        }

        socket.emit(SOCKET_EVENTS.WEBRTC_OFFER, {
          roomId: payload.roomId,
          toSocketId: payload.joinedSocketId,
          offer,
        })
        toast.success(`You have sent your offer to ${payload.user.username} successfully`)
      })()
    }

    socket.on(SOCKET_EVENTS.OTHER_PERSON_JOINED, handleOtherPersonJoined)

    return () => {
      socket.off(SOCKET_EVENTS.OTHER_PERSON_JOINED, handleOtherPersonJoined)
    }
  }, [socket, myStream])
}

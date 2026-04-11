import { useEffect } from 'react'
import type { Socket } from 'socket.io-client'
import { SOCKET_EVENTS } from '../socket/events'

type UseJoinRoomParams = {
  roomId?: string
  socket: Socket | null
  /** When false, skip joining the Socket.IO room (e.g. pre-join lobby). Connection is handled by SocketProvider. */
  initiateConnection?: boolean
}

export const useJoinRoom = ({
  roomId,
  socket,
  initiateConnection = true,
}: UseJoinRoomParams) => {
  useEffect(() => {
    if (!initiateConnection || !roomId || !socket) return
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId })
  }, [roomId, socket, initiateConnection])
}

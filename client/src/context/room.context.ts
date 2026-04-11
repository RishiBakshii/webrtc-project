import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { axiosi } from '../config/axios.config'
import { readMessage } from '../lib/utils'

interface Room {
  _id: string
  userId: string
  roomId: string
  roomname: string
  createdAt: string
  updatedAt: string
}

interface CreateRoomPayload {
  roomId: string
  roomname: string
}

interface CreateRoomResponse {
  message: string
  room: Room
}

interface RoomsByUserResponse {
  message: string
  rooms: Room[]
}

interface OtherUsersRoomsResponse {
  message: string
  rooms: Room[]
}

interface DeleteRoomResponse {
  message: string
  _id: string
  roomId: string
}

interface RoomContextValue {
  rooms: Room[]
  otherUsersRooms: Room[]
  activeRoomId: string | null
  isLoading: boolean
  error: string | null
  setActiveRoomId: (roomId: string | null) => void
  createRoom: (payload: CreateRoomPayload) => Promise<Room>
  /** MongoDB document `_id` for the room */
  deleteRoom: (id: string) => Promise<void>
  getRoomsByUser: () => Promise<Room[]>
  getOtherUsersRooms: () => Promise<Room[]>
  clearError: () => void
}

const RoomContext = createContext<RoomContextValue | undefined>(undefined)

export const RoomProvider = ({ children }: PropsWithChildren) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [otherUsersRooms, setOtherUsersRooms] = useState<Room[]>([])
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const createRoom = useCallback(async (payload: CreateRoomPayload) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await axiosi.post<CreateRoomResponse>('/room', payload)
      setRooms((prev) => [data.room, ...prev])
      return data.room
    } catch (err) {
      const message = readMessage(err)
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteRoom = useCallback(async (id: string) => {
    const trimmed = id.trim()
    if (!trimmed) return

    setError(null)
    try {
      const { data } = await axiosi.delete<DeleteRoomResponse>(
        `/room/${encodeURIComponent(trimmed)}`,
      )
      setRooms((prev) => prev.filter((r) => r._id !== data._id))
      setActiveRoomId((current) => (current === data.roomId ? null : current))
    } catch (err) {
      const message = readMessage(err)
      setError(message)
      throw err
    }
  }, [])

  const getRoomsByUser = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await axiosi.get<RoomsByUserResponse>('/room')
      setRooms(data.rooms)
      return data.rooms
    } catch (err) {
      const message = readMessage(err)
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getOtherUsersRooms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await axiosi.get<OtherUsersRoomsResponse>('/room/others')
      setOtherUsersRooms(data.rooms)
      return data.rooms
    } catch (err) {
      const message = readMessage(err)
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = useMemo<RoomContextValue>(
    () => ({
      rooms,
      otherUsersRooms,
      activeRoomId,
      isLoading,
      error,
      setActiveRoomId,
      createRoom,
      deleteRoom,
      getRoomsByUser,
      getOtherUsersRooms,
      clearError,
    }),
    [
      rooms,
      otherUsersRooms,
      activeRoomId,
      isLoading,
      error,
      createRoom,
      deleteRoom,
      getRoomsByUser,
      getOtherUsersRooms,
      clearError,
    ],
  )

  return createElement(RoomContext.Provider, { value }, children)
}

export const useRoom = () => {
  const context = useContext(RoomContext)
  if (!context) {
    throw new Error('useRoom must be used inside RoomProvider')
  }
  return context
}

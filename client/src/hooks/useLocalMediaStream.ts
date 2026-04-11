import { useEffect, useState } from 'react'

/**
 * Acquires the user's camera + microphone once on mount via getUserMedia, exposes the
 * resulting MediaStream for preview and WebRTC, and releases tracks on unmount. Also
 * surfaces permission/device errors for UI (e.g. lobby).
 */
export const useLocalMediaStream = () => {
  const [myStream, setMyStream] = useState<MediaStream | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let stream: MediaStream | null = null

    setMediaError(null)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        if (!mounted) {
          s.getTracks().forEach((track) => track.stop())
          return
        }
        stream = s
        setMyStream(s)
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error)
        if (mounted) {
          setMediaError(error instanceof Error ? error.message : 'Could not access camera or microphone')
        }
      })

    return () => {
      mounted = false
      stream?.getTracks().forEach((track) => track.stop())
      setMyStream(null)
      setMediaError(null)
    }
  }, [])

  return { myStream, mediaError }
}

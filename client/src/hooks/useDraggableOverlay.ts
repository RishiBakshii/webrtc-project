import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type SetStateAction,
} from 'react'

type Offset = { x: number; y: number }
type DragStart = { pointerX: number; pointerY: number; startX: number; startY: number }

function handleDraggablePointerDown(
  event: ReactPointerEvent<HTMLDivElement>,
  currentOffset: Offset,
  dragStartRef: MutableRefObject<DragStart | null>,
  setOffset: Dispatch<SetStateAction<Offset>>,
) {
  dragStartRef.current = {
    pointerX: event.clientX,
    pointerY: event.clientY,
    startX: currentOffset.x,
    startY: currentOffset.y,
  }

  const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
    if (!dragStartRef.current) return
    const deltaX = moveEvent.clientX - dragStartRef.current.pointerX
    const deltaY = moveEvent.clientY - dragStartRef.current.pointerY

    setOffset({
      x: dragStartRef.current.startX + deltaX,
      y: dragStartRef.current.startY + deltaY,
    })
  }

  const handlePointerUp = () => {
    dragStartRef.current = null
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
}

/**
 * Draggable overlay position (e.g. PiP self-view or screen-share preview).
 * Each overlay should use its own hook instance so drag state stays isolated.
 */
export function useDraggableOverlay(initial: Offset = { x: 0, y: 0 }) {
  const [offset, setOffset] = useState<Offset>(initial)
  const dragStartRef = useRef<DragStart | null>(null)

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      handleDraggablePointerDown(event, offset, dragStartRef, setOffset)
    },
    [offset],
  )

  return { offset, setOffset, handlePointerDown }
}

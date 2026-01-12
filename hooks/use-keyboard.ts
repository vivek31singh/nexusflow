import { useEffect, useCallback } from 'react'

type KeyboardHandler = (event: KeyboardEvent) => void

export function useKeyboard(
  key: string,
  handler: KeyboardHandler,
  options: {
    ctrlKey?: boolean
    shiftKey?: boolean
    altKey?: boolean
    metaKey?: boolean
    preventDefault?: boolean
  } = {}
) {
  const {
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    preventDefault = true,
  } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === ctrlKey &&
        event.shiftKey === shiftKey &&
        event.altKey === altKey &&
        event.metaKey === metaKey
      ) {
        if (preventDefault) {
          event.preventDefault()
        }
        handler(event)
      }
    },
    [key, ctrlKey, shiftKey, altKey, metaKey, preventDefault, handler]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
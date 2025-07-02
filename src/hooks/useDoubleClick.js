import { useRef } from 'react'

export const useDoubleClick = (onDoubleClick, onSingleClick = null, delay = 300) => {
  const clickTimeoutRef = useRef(null)

  const handleClick = (...args) => {
    if (clickTimeoutRef.current) {
      // Double click detected
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
      onDoubleClick?.(...args)
    } else {
      // Single click, wait to see if there's a second click
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null
        onSingleClick?.(...args)
      }, delay)
    }
  }

  return handleClick
}
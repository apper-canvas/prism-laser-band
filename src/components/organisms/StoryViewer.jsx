import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpring, animated } from 'react-spring'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'
import { markStoryAsViewed, getStoryViewers } from '@/services/api/storyService'
import { getUserById } from '@/services/api/userService'
import { toast } from 'react-toastify'

const StoryViewer = ({ stories, currentIndex = 0, userId, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [user, setUser] = useState(null)
  const [viewers, setViewers] = useState([])
  const [showInfo, setShowInfo] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const progressRef = useRef(null)
  const timerRef = useRef(null)

  const STORY_DURATION = 5000 // 5 seconds per story

  // Spring animation for progress bar
  const progressSpring = useSpring({
    width: `${progress}%`,
    config: { tension: 300, friction: 30 }
  })

  useEffect(() => {
    if (stories.length === 0) {
      onClose()
      return
    }

    loadUser()
    loadViewers()
    markCurrentStoryAsViewed()
  }, [activeIndex, stories, userId])

  useEffect(() => {
    if (!isPaused) {
      startProgressTimer()
    } else {
      clearTimer()
    }

    return () => clearTimer()
  }, [activeIndex, isPaused])

  const loadUser = async () => {
    if (userId) {
      try {
        const userData = await getUserById(userId)
        setUser(userData)
      } catch (err) {
        console.error('Failed to load user:', err)
      }
    }
  }

  const loadViewers = async () => {
    if (stories[activeIndex]) {
      try {
        const viewerIds = await getStoryViewers(stories[activeIndex].Id)
        setViewers(viewerIds)
      } catch (err) {
        console.error('Failed to load viewers:', err)
      }
    }
  }

  const markCurrentStoryAsViewed = async () => {
    if (stories[activeIndex]) {
      try {
        await markStoryAsViewed(stories[activeIndex].Id, 1) // Current user ID
      } catch (err) {
        console.error('Failed to mark story as viewed:', err)
      }
    }
  }

  const startProgressTimer = useCallback(() => {
    clearTimer()
    setProgress(0)
    
    const startTime = Date.now()
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / STORY_DURATION) * 100
      
      if (newProgress >= 100) {
        setProgress(100)
        setTimeout(() => goToNext(), 100)
      } else {
        setProgress(newProgress)
        timerRef.current = requestAnimationFrame(updateProgress)
      }
    }
    
    timerRef.current = requestAnimationFrame(updateProgress)
  }, [activeIndex])

  const clearTimer = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current)
      timerRef.current = null
    }
  }

  const goToPrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
    } else {
      onClose()
    }
  }

  const goToNext = () => {
    if (activeIndex < stories.length - 1) {
      setActiveIndex(activeIndex + 1)
    } else {
      onClose()
    }
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (!touchStart) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }

    setTouchStart(null)
  }

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowLeft':
        goToPrevious()
        break
      case 'ArrowRight':
      case ' ':
        goToNext()
        break
      case 'Escape':
        onClose()
        break
    }
  }, [activeIndex])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const currentStory = stories[activeIndex]

  if (!currentStory) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 story-overlay flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="flex space-x-1">
            {stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 story-progress">
                <animated.div
                  className="story-progress-fill h-full"
                  style={index === activeIndex ? progressSpring : {
                    width: index < activeIndex ? '100%' : '0%'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {user && (
              <>
                <Avatar src={user.avatar} alt={user.username} size="sm" />
                <div>
                  <p className="text-white font-semibold text-sm">{user.username}</p>
                  <p className="text-white/70 text-xs">
                    {new Date(currentStory.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-full bg-black/20 text-white"
            >
              <ApperIcon name={isPaused ? "Play" : "Pause"} size={16} />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-full bg-black/20 text-white"
            >
              <ApperIcon name="Info" size={16} />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-black/20 text-white"
            >
              <ApperIcon name="X" size={16} />
            </motion.button>
          </div>
        </div>

        {/* Navigation zones */}
        <div className="story-nav-left" onClick={goToPrevious} />
        <div className="story-nav-right" onClick={goToNext} />

        {/* Story content */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-sm w-full mx-4"
        >
          {currentStory.mediaType === 'image' ? (
            <img
              src={currentStory.mediaUrl}
              alt="Story content"
              className="w-full story-content rounded-2xl object-cover"
              onLoad={() => setIsPaused(false)}
            />
          ) : (
            <video
              src={currentStory.mediaUrl}
              className="w-full story-content rounded-2xl object-cover"
              autoPlay
              muted
              onLoadedData={() => setIsPaused(false)}
            />
          )}
          
          {/* Caption */}
          {currentStory.caption && (
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm bg-black/30 rounded-lg px-3 py-2 backdrop-blur-sm">
                {currentStory.caption}
              </p>
            </div>
          )}
        </motion.div>

        {/* Story info panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-30 p-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Story Info</h3>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Views</p>
                  <p className="text-2xl font-bold">{currentStory.viewCount}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Posted</p>
                  <p className="font-medium">
                    {new Date(currentStory.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Expires</p>
                  <p className="font-medium">
                    {new Date(currentStory.expiresAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile gesture indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 md:hidden">
          <div className="flex items-center space-x-1 text-white/70 text-xs">
            <ApperIcon name="ChevronLeft" size={12} />
            <span>Tap left</span>
          </div>
          <div className="flex items-center space-x-1 text-white/70 text-xs">
            <span>Tap right</span>
            <ApperIcon name="ChevronRight" size={12} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default StoryViewer
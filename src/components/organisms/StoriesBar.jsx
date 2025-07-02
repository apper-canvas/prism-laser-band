import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'
import StoryAvatar from '@/components/molecules/StoryAvatar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getUsers } from '@/services/api/userService'
import { getStories, getStoriesByUserId } from '@/services/api/storyService'
import { toast } from 'react-toastify'

const StoriesBar = () => {
  const [users, setUsers] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { openStoryViewer } = useOutletContext() || {}

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [usersData, storiesData] = await Promise.all([
        getUsers(),
        getStories()
      ])
      
      // Filter users who have active stories (within last 24 hours)
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      const activeStories = storiesData.filter(story => 
        new Date(story.createdAt) > twentyFourHoursAgo
      )
      
      const usersWithStories = usersData.filter(user =>
        activeStories.some(story => story.userId === user.Id)
      ).slice(0, 10)
      
      setUsers(usersWithStories)
      setStories(activeStories)
    } catch (err) {
      setError('Failed to load stories')
      toast.error('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }

  const handleStoryClick = async (user) => {
    if (!openStoryViewer) {
      toast.error('Story viewer not available')
      return
    }

    try {
      const userStories = await getStoriesByUserId(user.Id)
      
      if (userStories.length === 0) {
        toast.info('No active stories for this user')
        return
      }

      // Filter active stories (within 24 hours)
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const activeUserStories = userStories.filter(story => 
        new Date(story.createdAt) > twentyFourHoursAgo
      )

      if (activeUserStories.length === 0) {
        toast.info('No active stories for this user')
        return
      }

      openStoryViewer(activeUserStories, 0, user.Id)
    } catch (err) {
      toast.error('Failed to load user stories')
    }
  }

  const getUserStoryStatus = (userId) => {
    const userStories = stories.filter(story => story.userId === userId)
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    return userStories.some(story => 
      new Date(story.createdAt) > twentyFourHoursAgo && !story.viewed
    )
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  if (users.length === 0) {
    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-md mx-auto px-4">
          <p className="text-gray-500 text-center text-sm">No active stories</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-md mx-auto">
        <div className="flex space-x-4 px-4 overflow-x-auto scrollbar-hide">
          {users.map((user, index) => (
            <motion.div
              key={user.Id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <StoryAvatar
                user={{
                  username: user.username,
                  avatar: user.avatar
                }}
                hasNewStory={getUserStoryStatus(user.Id)}
                onClick={() => handleStoryClick(user)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StoriesBar
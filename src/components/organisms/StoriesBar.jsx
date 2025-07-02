import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import StoryAvatar from '@/components/molecules/StoryAvatar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { getUsers } from '@/services/api/userService'

const StoriesBar = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getUsers()
      setUsers(data.slice(0, 10)) // Show first 10 users for stories
    } catch (err) {
      setError('Failed to load stories')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadUsers} />

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
                hasNewStory={Math.random() > 0.5}
                onClick={() => console.log('View story:', user.username)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StoriesBar
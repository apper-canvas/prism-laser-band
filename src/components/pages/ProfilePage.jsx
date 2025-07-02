import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileHeader from '@/components/organisms/ProfileHeader'
import PostGrid from '@/components/organisms/PostGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { getCurrentUser } from '@/services/api/userService'
import { getPostsByUser } from '@/services/api/postService'

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const currentUser = await getCurrentUser()
      const userPosts = await getPostsByUser(currentUser.Id)
      
      setUser(currentUser)
      setPosts(userPosts)
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Loading type="profile" />
        <div className="max-w-md mx-auto px-4">
          <Loading type="grid" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error message={error} onRetry={loadProfileData} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error message="User not found" />
      </div>
    )
  }

return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        <ProfileHeader user={user} isOwnProfile={true} />
        
        {/* My Story Section */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">My Story</h3>
              <p className="text-sm text-gray-500">Share what's happening</p>
            </div>
            <button
              onClick={() => navigate('/my-story')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
            >
              <ApperIcon name="Plus" size={16} />
              <span>Add Story</span>
            </button>
          </div>
        </div>
        
        <div className="px-4 py-6">
          {posts.length > 0 ? (
            <PostGrid posts={posts} />
          ) : (
            <Empty
              title="No posts yet"
              message="Share your first moment and start building your story!"
              actionText="Create First Post"
              onAction={() => navigate('/create')}
              icon="Camera"
            />
          )}
        </div>
      </div>
</div>
  )
}

export default ProfilePage
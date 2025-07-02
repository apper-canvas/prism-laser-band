import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileHeader from '@/components/organisms/ProfileHeader'
import PostGrid from '@/components/organisms/PostGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
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
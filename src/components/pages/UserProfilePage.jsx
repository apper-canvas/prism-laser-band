import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProfileHeader from '@/components/organisms/ProfileHeader'
import PostGrid from '@/components/organisms/PostGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { getUserByUsername } from '@/services/api/userService'
import { getPostsByUser } from '@/services/api/postService'

const UserProfilePage = () => {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUserProfile()
  }, [username])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      setError('')
      
      const userData = await getUserByUsername(username)
      if (!userData) {
        setError('User not found')
        return
      }
      
      const userPosts = await getPostsByUser(userData.Id)
      
      setUser(userData)
      setPosts(userPosts)
    } catch (err) {
      setError('Failed to load user profile')
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
        <Error message={error} onRetry={loadUserProfile} />
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
        <ProfileHeader user={user} isOwnProfile={false} />
        
        <div className="px-4 py-6">
          {posts.length > 0 ? (
            <PostGrid posts={posts} />
          ) : (
            <Empty
              title="No posts yet"
              message={`${user.username} hasn't shared any posts yet.`}
              icon="Camera"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
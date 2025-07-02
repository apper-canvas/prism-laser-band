import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StoriesBar from '@/components/organisms/StoriesBar'
import PostCard from '@/components/organisms/PostCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { getPosts } from '@/services/api/postService'
import { getUsers } from '@/services/api/userService'

const FeedPage = () => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadFeedData()
  }, [])

  const loadFeedData = async () => {
    try {
      setLoading(true)
      setError('')
      const [postsData, usersData] = await Promise.all([
        getPosts(),
        getUsers()
      ])
      setPosts(postsData)
      setUsers(usersData)
    } catch (err) {
      setError('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadFeedData} />
  if (posts.length === 0) {
    return (
      <Empty
        title="Welcome to Prism!"
        message="Follow people to see their posts in your feed, or create your first post to get started."
        actionText="Create Your First Post"
        onAction={() => navigate('/create')}
        icon="Camera"
      />
    )
  }

  const getUserForPost = (userId) => {
    return users.find(user => user.Id === userId) || {
      Id: userId,
      username: 'unknown_user',
      avatar: null,
      displayName: 'Unknown User'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <StoriesBar />
      
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.Id}
              post={post}
              user={getUserForPost(post.userId)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeedPage
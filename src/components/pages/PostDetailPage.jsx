import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import Avatar from '@/components/atoms/Avatar'
import PostActions from '@/components/molecules/PostActions'
import CommentInput from '@/components/molecules/CommentInput'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getPostById } from '@/services/api/postService'
import { getUserById } from '@/services/api/userService'
import { toast } from 'react-toastify'

const PostDetailPage = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comments, setComments] = useState([])

  useEffect(() => {
    loadPostDetail()
  }, [id])

  const loadPostDetail = async () => {
    try {
      setLoading(true)
      setError('')
      
      const postData = await getPostById(parseInt(id))
      if (!postData) {
        setError('Post not found')
        return
      }
      
      const userData = await getUserById(postData.userId)
      
      setPost(postData)
      setUser(userData)
      setComments(postData.comments || [])
    } catch (err) {
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const handleComment = (comment) => {
    const newComment = {
      Id: Date.now(),
      text: comment,
      userId: 1, // Current user ID
      timestamp: new Date().toISOString(),
      parentId: null
    }
    
    setComments(prev => [...prev, newComment])
    toast.success('Comment added!')
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadPostDetail} />
  if (!post || !user) return <Error message="Post not found" />

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link 
            to="/"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} className="text-gray-700" />
          </Link>
          <h1 className="font-semibold text-gray-900">Post</h1>
          <div className="w-8"></div>
        </div>

        {/* Post Header */}
        <div className="flex items-center justify-between p-4">
          <Link 
            to={`/user/${user.username}`}
            className="flex items-center space-x-3"
          >
            <Avatar
              src={user.avatar}
              alt={user.username}
              size="md"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{user.username}</h3>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
              </p>
            </div>
          </Link>
          
          <button className="p-1">
            <ApperIcon name="MoreHorizontal" size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Post Image */}
        <div className="aspect-square bg-gray-100">
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Post Actions */}
        <PostActions
          postId={post.Id}
          initialLikes={post.likes}
          initialLiked={false}
        />

        {/* Likes Count */}
        <div className="px-4 pb-2">
          <p className="font-semibold text-sm text-gray-900">
            {post.likes.toLocaleString()} likes
          </p>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="px-4 pb-4">
            <p className="text-sm text-gray-900">
              <Link 
                to={`/user/${user.username}`}
                className="font-semibold mr-2"
              >
                {user.username}
              </Link>
              {post.caption}
            </p>
          </div>
        )}

        {/* Comments */}
        <div className="border-t border-gray-200">
          {comments.length > 0 && (
            <div className="px-4 py-4">
              <h4 className="font-semibold text-gray-900 mb-4">
                Comments ({comments.length})
              </h4>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.Id} className="flex space-x-3">
                    <Avatar size="sm" />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="font-semibold text-sm text-gray-900 mb-1">
                          user_{comment.userId}
                        </p>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Comment Input */}
          <CommentInput onSubmit={handleComment} />
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage
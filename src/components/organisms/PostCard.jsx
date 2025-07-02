import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Avatar from '@/components/atoms/Avatar'
import PostActions from '@/components/molecules/PostActions'
import CommentInput from '@/components/molecules/CommentInput'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const PostCard = ({ post, user }) => {
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(false)

  const handleDoubleClick = () => {
    if (!liked) {
      setLiked(true)
      toast.success('❤️ Liked!')
    }
  }

  const handleComment = (comment) => {
    console.log('New comment:', comment)
    toast.success('Comment added!')
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6"
    >
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
      <div 
        className="relative aspect-square bg-gray-100 cursor-pointer"
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-full object-cover"
        />
        {liked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <ApperIcon name="Heart" size={80} className="text-white fill-red-500" />
          </motion.div>
        )}
      </div>

      {/* Post Actions */}
      <PostActions
        postId={post.Id}
        initialLikes={post.likes}
        initialLiked={liked}
        onComment={() => setShowComments(!showComments)}
      />

      {/* Likes Count */}
      <div className="px-4 pb-2">
        <p className="font-semibold text-sm text-gray-900">
          {post.likes.toLocaleString()} likes
        </p>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-2">
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

      {/* Comments Preview */}
      {post.comments && post.comments.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            View all {post.comments.length} comments
          </button>
        </div>
      )}

      {/* Comment Input */}
      <CommentInput onSubmit={handleComment} />
    </motion.article>
  )
}

export default PostCard
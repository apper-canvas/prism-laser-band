import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const PostActions = ({ 
  postId, 
  initialLikes = 0, 
  initialLiked = false, 
  initialSaved = false,
  onLike,
  onComment,
  onShare,
  onSave
}) => {
  const [liked, setLiked] = useState(initialLiked)
  const [likes, setLikes] = useState(initialLikes)
  const [saved, setSaved] = useState(initialSaved)

  const handleLike = () => {
    const newLiked = !liked
    setLiked(newLiked)
    setLikes(prev => newLiked ? prev + 1 : prev - 1)
    onLike?.(postId, newLiked)
  }

  const handleSave = () => {
    const newSaved = !saved
    setSaved(newSaved)
    onSave?.(postId, newSaved)
    toast.success(newSaved ? 'Post saved!' : 'Post removed from saved')
  }

  const handleShare = () => {
    onShare?.(postId)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="flex items-center space-x-1"
        >
          <ApperIcon 
            name="Heart" 
            size={24} 
            className={`transition-colors duration-200 ${
              liked 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-700 hover:text-red-500'
            }`}
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onComment}
          className="flex items-center space-x-1"
        >
          <ApperIcon 
            name="MessageCircle" 
            size={24} 
            className="text-gray-700 hover:text-primary transition-colors duration-200" 
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="flex items-center space-x-1"
        >
          <ApperIcon 
            name="Send" 
            size={24} 
            className="text-gray-700 hover:text-primary transition-colors duration-200" 
          />
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSave}
        className="flex items-center space-x-1"
      >
        <ApperIcon 
          name="Bookmark" 
          size={24} 
          className={`transition-colors duration-200 ${
            saved 
              ? 'text-primary fill-primary' 
              : 'text-gray-700 hover:text-primary'
          }`}
        />
      </motion.button>
    </div>
  )
}

export default PostActions
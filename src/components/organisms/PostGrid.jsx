import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const PostGrid = ({ posts }) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post, index) => (
        <motion.div
          key={post.Id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative aspect-square bg-gray-200 group cursor-pointer"
        >
          <Link to={`/post/${post.Id}`}>
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Heart" size={20} className="fill-white" />
                  <span className="font-semibold">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="MessageCircle" size={20} className="fill-white" />
                  <span className="font-semibold">{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

export default PostGrid
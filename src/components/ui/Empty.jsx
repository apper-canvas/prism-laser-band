import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Start by creating your first post!", 
  actionText = "Create Post",
  onAction,
  icon = "Image"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-sm">
        {message}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          className="inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>{actionText}</span>
        </Button>
      )}
    </motion.div>
  )
}

export default Empty
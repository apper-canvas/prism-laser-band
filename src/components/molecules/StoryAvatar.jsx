import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'

const StoryAvatar = ({ user, hasNewStory = false, onClick }) => {
  return (
    <motion.div 
      className="flex flex-col items-center space-y-1 min-w-0 cursor-pointer"
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick?.(user)}
    >
      <div className="relative">
        <Avatar
          src={user.avatar}
          alt={user.username}
          size="lg"
          hasStory={hasNewStory}
          onClick={() => onClick?.(user)}
        />
        {hasNewStory && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      <span className="text-xs text-gray-700 font-medium truncate w-16 text-center">
        {user.username}
      </span>
    </motion.div>
  )
}

export default StoryAvatar
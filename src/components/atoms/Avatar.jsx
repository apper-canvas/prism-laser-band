import { motion } from 'framer-motion'

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  hasStory = false, 
  className = '',
  onClick 
}) => {
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  }

  const storyRingSize = {
    xs: 'w-9 h-9',
    sm: 'w-11 h-11',
    md: 'w-14 h-14',
    lg: 'w-18 h-18',
    xl: 'w-22 h-22',
    '2xl': 'w-26 h-26'
  }

  const AvatarContent = () => (
    <img
      src={src || 'https://via.placeholder.com/80x80/E1306C/ffffff?text=U'}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover ${className}`}
    />
  )

  if (hasStory) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${storyRingSize[size]} rounded-full p-0.5 story-ring cursor-pointer flex items-center justify-center`}
        onClick={onClick}
      >
        <div className="bg-white rounded-full p-0.5">
          <AvatarContent />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <AvatarContent />
    </motion.div>
  )
}

export default Avatar
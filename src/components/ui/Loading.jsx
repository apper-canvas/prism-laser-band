import { motion } from 'framer-motion'

const Loading = ({ type = 'posts' }) => {
  if (type === 'stories') {
    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex space-x-4 px-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 rounded-full shimmer"></div>
                <div className="w-12 h-3 rounded shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'profile') {
    return (
      <div className="bg-white p-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full shimmer"></div>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-32 h-6 rounded shimmer"></div>
              <div className="w-20 h-8 rounded shimmer"></div>
            </div>
            <div className="flex space-x-8 mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-8 h-5 rounded shimmer mb-1"></div>
                  <div className="w-12 h-4 rounded shimmer"></div>
                </div>
              ))}
            </div>
            <div className="w-48 h-4 rounded shimmer"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-3 gap-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square shimmer"></div>
        ))}
      </div>
    )
  }

  // Default posts loading
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          {/* Header skeleton */}
          <div className="flex items-center space-x-3 p-4">
            <div className="w-12 h-12 rounded-full shimmer"></div>
            <div className="flex-1">
              <div className="w-24 h-4 rounded shimmer mb-2"></div>
              <div className="w-16 h-3 rounded shimmer"></div>
            </div>
          </div>
          
          {/* Image skeleton */}
          <div className="aspect-square shimmer"></div>
          
          {/* Actions skeleton */}
          <div className="p-4">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-6 h-6 rounded shimmer"></div>
              <div className="w-6 h-6 rounded shimmer"></div>
              <div className="w-6 h-6 rounded shimmer"></div>
            </div>
            <div className="w-20 h-4 rounded shimmer mb-2"></div>
            <div className="w-full h-4 rounded shimmer mb-1"></div>
            <div className="w-3/4 h-4 rounded shimmer"></div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Loading
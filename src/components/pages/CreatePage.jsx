import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { createPost } from '@/services/api/postService'

const CreatePage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [caption, setCaption] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const filters = [
    { name: 'none', label: 'Original' },
    { name: 'vintage', label: 'Vintage' },
    { name: 'dramatic', label: 'Dramatic' },
    { name: 'warm', label: 'Warm' },
    { name: 'cool', label: 'Cool' },
    { name: 'bright', label: 'Bright' }
  ]

  const sampleImages = [
    'https://picsum.photos/400/400?random=1',
    'https://picsum.photos/400/400?random=2',
    'https://picsum.photos/400/400?random=3',
    'https://picsum.photos/400/400?random=4',
    'https://picsum.photos/400/400?random=5',
    'https://picsum.photos/400/400?random=6'
  ]

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl)
    setImagePreview(imageUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedImage) {
      toast.error('Please select an image')
      return
    }

    try {
      setLoading(true)
      
      const newPost = {
        imageUrl: selectedImage,
        caption: caption.trim(),
        filter: selectedFilter,
        userId: 1 // Current user ID
      }
      
      await createPost(newPost)
      toast.success('Post created successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const getFilterStyle = (filter) => {
    const styles = {
      none: '',
      vintage: 'sepia(0.3) contrast(1.2) brightness(0.9)',
      dramatic: 'contrast(1.4) brightness(0.8) saturate(1.3)',
      warm: 'sepia(0.2) saturate(1.2) hue-rotate(10deg)',
      cool: 'saturate(1.1) hue-rotate(-10deg) brightness(1.1)',
      bright: 'brightness(1.2) contrast(1.1) saturate(1.2)'
    }
    return styles[filter] || ''
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-display font-bold gradient-text mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600">Share your moment with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Selection */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Choose Image</h3>
            
            {!selectedImage ? (
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((image, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleImageSelect(image)}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{ filter: getFilterStyle(selectedFilter) }}
                  />
                </div>
                
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedImage(null)
                    setImagePreview('')
                  }}
                  className="w-full"
                >
                  Choose Different Image
                </Button>
              </div>
            )}
          </div>

          {/* Filters */}
          {selectedImage && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Apply Filter</h3>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {filters.map((filter) => (
                  <motion.button
                    key={filter.name}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFilter(filter.name)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedFilter === filter.name
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Caption */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <Input
              label="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="resize-none h-24"
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedImage}
              className="flex-1 inline-flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Send" size={16} />
                  <span>Share Post</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePage
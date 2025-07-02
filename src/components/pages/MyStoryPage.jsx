import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { getCurrentUser } from '@/services/api/userService'
import { createStory } from '@/services/api/storyService'
import { toast } from 'react-toastify'

const MyStoryPage = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState('')
  const [caption, setCaption] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      setLoading(true)
      setError('')
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please select an image or video file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setMediaFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setMediaPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleCreateStory = async () => {
    if (!mediaFile) {
      toast.error('Please select a media file')
      return
    }

    try {
      setCreating(true)
      
      // In a real app, you would upload the file to a server first
      // For now, we'll use a placeholder URL
      const mediaUrl = URL.createObjectURL(mediaFile)
      const mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video'
      
      await createStory({
        userId: user.Id,
        mediaUrl,
        mediaType,
        caption
      })

      toast.success('Story created successfully!')
      navigate('/profile')
    } catch (err) {
      toast.error('Failed to create story')
    } finally {
      setCreating(false)
    }
  }

  const handleRemoveMedia = () => {
    setMediaFile(null)
    setMediaPreview('')
    // Reset file input
    const fileInput = document.getElementById('media-input')
    if (fileInput) fileInput.value = ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error message={error} onRetry={loadUser} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} />
              </button>
              <h1 className="text-lg font-semibold">Create Story</h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Media Upload */}
          <div className="space-y-4">
            <h2 className="text-md font-medium">Add Media</h2>
            
            {!mediaPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  id="media-input"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
                <label
                  htmlFor="media-input"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="Camera" size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Add Photo or Video</p>
                    <p className="text-xs text-gray-500">Tap to select from gallery</p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden bg-black">
                {mediaFile?.type.startsWith('image/') ? (
                  <img
                    src={mediaPreview}
                    alt="Story preview"
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    className="w-full h-80 object-cover"
                    controls
                  />
                )}
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Caption */}
          {mediaPreview && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Caption (Optional)</label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                maxLength={100}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">{caption.length}/100</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleCreateStory}
              disabled={!mediaFile || creating}
              className="w-full"
              variant="primary"
            >
              {creating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Story...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="Plus" size={16} />
                  <span>Share Story</span>
                </div>
              )}
            </Button>
            
            <Button
              onClick={() => navigate('/profile')}
              variant="secondary"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyStoryPage
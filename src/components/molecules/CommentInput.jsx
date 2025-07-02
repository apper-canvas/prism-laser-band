import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const CommentInput = ({ onSubmit, placeholder = "Add a comment..." }) => {
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      onSubmit(comment.trim())
      setComment('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 px-4 py-3 border-t border-gray-200">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={placeholder}
        className="flex-1 py-2 text-sm placeholder-gray-500 bg-transparent border-none outline-none"
      />
      {comment.trim() && (
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="text-primary hover:text-secondary font-semibold"
        >
          Post
        </Button>
      )}
    </form>
  )
}

export default CommentInput
import Avatar from '@/components/atoms/Avatar'

const StoryAvatar = ({ user, hasNewStory = false, onClick }) => {
  return (
    <div className="flex flex-col items-center space-y-1 min-w-0">
      <Avatar
        src={user.avatar}
        alt={user.username}
        size="lg"
        hasStory={hasNewStory}
        onClick={() => onClick?.(user)}
      />
      <span className="text-xs text-gray-700 font-medium truncate w-16 text-center">
        {user.username}
      </span>
    </div>
  )
}

export default StoryAvatar
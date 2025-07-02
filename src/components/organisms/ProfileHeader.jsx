import { useState } from 'react'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const ProfileHeader = ({ user, isOwnProfile = false }) => {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? 'Unfollowed' : 'Following!')
  }

  return (
    <div className="bg-white p-6">
      <div className="flex items-center space-x-6">
        <Avatar
          src={user.avatar}
          alt={user.username}
          size="2xl"
        />
        
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {user.username}
            </h1>
            
            {isOwnProfile ? (
              <Button variant="secondary" size="sm">
                Edit Profile
              </Button>
            ) : (
              <Button 
                variant={isFollowing ? "secondary" : "primary"}
                size="sm"
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
            
            <button className="p-1">
              <ApperIcon name="MoreHorizontal" size={20} className="text-gray-600" />
            </button>
          </div>
          
          <div className="flex space-x-8 mb-4">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{user.postsCount}</div>
              <div className="text-sm text-gray-500">posts</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{user.followersCount}</div>
              <div className="text-sm text-gray-500">followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">{user.followingCount}</div>
              <div className="text-sm text-gray-500">following</div>
            </div>
          </div>
          
          {user.displayName && (
            <div className="font-semibold text-gray-900 mb-1">
              {user.displayName}
            </div>
          )}
          
          {user.bio && (
            <div className="text-sm text-gray-600">
              {user.bio}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import PostGrid from '@/components/organisms/PostGrid'
import Avatar from '@/components/atoms/Avatar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { getPosts } from '@/services/api/postService'
import { getUsers } from '@/services/api/userService'

const SearchPage = () => {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('posts')

  const trendingHashtags = [
    '#photography', '#art', '#nature', '#lifestyle', '#travel',
    '#food', '#fashion', '#sunset', '#portrait', '#street'
  ]

  useEffect(() => {
    loadSearchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(post => 
        post.caption?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPosts(filtered)
      
      const filteredUserList = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filteredUserList)
    } else {
      setFilteredPosts([])
      setFilteredUsers([])
    }
  }, [searchTerm, posts, users])

  const loadSearchData = async () => {
    try {
      setLoading(true)
      setError('')
      const [postsData, usersData] = await Promise.all([
        getPosts(),
        getUsers()
      ])
      setPosts(postsData)
      setUsers(usersData)
    } catch (err) {
      setError('Failed to load search data')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term.trim())
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadSearchData} />

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search posts and people..."
          className="mb-6"
        />

        {searchTerm ? (
          <div>
            {/* Search Results Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'posts'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Posts ({filteredPosts.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                People ({filteredUsers.length})
              </button>
            </div>

            {/* Search Results */}
            {activeTab === 'posts' && (
              <div>
                {filteredPosts.length > 0 ? (
                  <PostGrid posts={filteredPosts} />
                ) : (
                  <Empty
                    title="No posts found"
                    message={`No posts match "${searchTerm}". Try a different search term.`}
                    icon="Search"
                  />
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <motion.div
                      key={user.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                    >
                      <Link
                        to={`/user/${user.username}`}
                        className="flex items-center space-x-3"
                      >
                        <Avatar
                          src={user.avatar}
                          alt={user.username}
                          size="md"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {user.username}
                          </h3>
                          {user.displayName && (
                            <p className="text-sm text-gray-600">
                              {user.displayName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {user.followersCount} followers
                          </p>
                        </div>
                        <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <Empty
                    title="No people found"
                    message={`No users match "${searchTerm}". Try a different search term.`}
                    icon="Users"
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Trending Hashtags */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Trending Hashtags
              </h2>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((hashtag) => (
                  <motion.button
                    key={hashtag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchTerm(hashtag)}
                    className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 
                             text-primary font-medium rounded-full text-sm
                             hover:from-primary/20 hover:to-secondary/20 transition-all"
                  >
                    {hashtag}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Explore Posts */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Explore
              </h2>
              {posts.length > 0 ? (
                <PostGrid posts={posts} />
              ) : (
                <Empty
                  title="No posts to explore"
                  message="Be the first to share something amazing!"
                  icon="Camera"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
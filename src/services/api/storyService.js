import storiesData from '@/services/mockData/stories.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Track the last used ID for generating new IDs
let lastId = Math.max(...storiesData.map(story => story.Id), 0)

export const getStories = async () => {
  await delay(300)
  return [...storiesData]
}

export const getStoryById = async (id) => {
  await delay(200)
  const parsedId = parseInt(id)
  return storiesData.find(story => story.Id === parsedId) || null
}

export const getStoriesByUserId = async (userId) => {
  await delay(200)
  const parsedUserId = parseInt(userId)
  return storiesData.filter(story => story.userId === parsedUserId)
}

export const getActiveStories = async () => {
  await delay(300)
  const now = new Date()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  return storiesData.filter(story => 
    new Date(story.createdAt) > twentyFourHoursAgo
  )
}

export const createStory = async (storyData) => {
  await delay(400)
  
  const newStory = {
    Id: ++lastId,
    userId: parseInt(storyData.userId),
    mediaUrl: storyData.mediaUrl,
    mediaType: storyData.mediaType || 'image',
    caption: storyData.caption || '',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    viewed: false,
    viewCount: 0,
    viewers: []
  }
  
  storiesData.push(newStory)
  return { ...newStory }
}

export const updateStory = async (id, storyData) => {
  await delay(300)
  const parsedId = parseInt(id)
  const storyIndex = storiesData.findIndex(story => story.Id === parsedId)
  
  if (storyIndex === -1) {
    throw new Error('Story not found')
  }
  
  storiesData[storyIndex] = { 
    ...storiesData[storyIndex], 
    ...storyData,
    Id: parsedId // Ensure ID doesn't change
  }
  
  return { ...storiesData[storyIndex] }
}

export const deleteStory = async (id) => {
  await delay(300)
  const parsedId = parseInt(id)
  const storyIndex = storiesData.findIndex(story => story.Id === parsedId)
  
  if (storyIndex === -1) {
    throw new Error('Story not found')
  }
  
  const deletedStory = storiesData.splice(storyIndex, 1)[0]
  return { ...deletedStory }
}

export const markStoryAsViewed = async (id, viewerId) => {
  await delay(200)
  const parsedId = parseInt(id)
  const parsedViewerId = parseInt(viewerId)
  const story = storiesData.find(story => story.Id === parsedId)
  
  if (!story) {
    throw new Error('Story not found')
  }
  
  if (!story.viewers.includes(parsedViewerId)) {
    story.viewers.push(parsedViewerId)
    story.viewCount = story.viewers.length
  }
  
  return { ...story }
}

export const getStoryViewers = async (id) => {
  await delay(200)
  const parsedId = parseInt(id)
  const story = storiesData.find(story => story.Id === parsedId)
  
  if (!story) {
    throw new Error('Story not found')
  }
  
  return story.viewers || []
}
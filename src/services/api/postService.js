import postsData from '@/services/mockData/posts.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let posts = [...postsData]

export const getPosts = async () => {
  await delay(400)
  return [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const getPostById = async (id) => {
  await delay(200)
  return posts.find(post => post.Id === id) || null
}

export const getPostsByUser = async (userId) => {
  await delay(300)
  return posts.filter(post => post.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const createPost = async (postData) => {
  await delay(500)
  
  const highestId = Math.max(...posts.map(post => post.Id), 0)
  const newPost = {
    Id: highestId + 1,
    ...postData,
    likes: 0,
    comments: [],
    timestamp: new Date().toISOString()
  }
  
  posts.unshift(newPost)
  return newPost
}

export const updatePost = async (id, postData) => {
  await delay(400)
  const postIndex = posts.findIndex(post => post.Id === id)
  if (postIndex === -1) {
    throw new Error('Post not found')
  }
  
  posts[postIndex] = { ...posts[postIndex], ...postData }
  return posts[postIndex]
}

export const deletePost = async (id) => {
  await delay(300)
  const postIndex = posts.findIndex(post => post.Id === id)
  if (postIndex === -1) {
    throw new Error('Post not found')
  }
  
  posts.splice(postIndex, 1)
  return true
}

export const likePost = async (id) => {
  await delay(200)
  const post = posts.find(post => post.Id === id)
  if (!post) {
    throw new Error('Post not found')
  }
  
  post.likes += 1
  return post
}

export const unlikePost = async (id) => {
  await delay(200)
  const post = posts.find(post => post.Id === id)
  if (!post) {
    throw new Error('Post not found')
  }
  
  post.likes = Math.max(0, post.likes - 1)
  return post
}
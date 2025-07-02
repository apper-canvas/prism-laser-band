import usersData from '@/services/mockData/users.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getUsers = async () => {
  await delay(300)
  return [...usersData]
}

export const getUserById = async (id) => {
  await delay(200)
  return usersData.find(user => user.Id === id) || null
}

export const getUserByUsername = async (username) => {
  await delay(200)
  return usersData.find(user => user.username === username) || null
}

export const getCurrentUser = async () => {
  await delay(200)
  // Return first user as current user for demo
  return usersData[0]
}

export const updateUser = async (id, userData) => {
  await delay(400)
  const userIndex = usersData.findIndex(user => user.Id === id)
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  usersData[userIndex] = { ...usersData[userIndex], ...userData }
  return usersData[userIndex]
}
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from '@/components/organisms/Header'
import BottomNavigation from '@/components/organisms/BottomNavigation'
import StoryViewer from '@/components/organisms/StoryViewer'

const Layout = () => {
  const [storyViewer, setStoryViewer] = useState({
    isOpen: false,
    stories: [],
    currentIndex: 0,
    userId: null
  })

  const openStoryViewer = (stories, startIndex = 0, userId = null) => {
    setStoryViewer({
      isOpen: true,
      stories,
      currentIndex: startIndex,
      userId
    })
  }

  const closeStoryViewer = () => {
    setStoryViewer({
      isOpen: false,
      stories: [],
      currentIndex: 0,
      userId: null
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20">
        <Outlet context={{ openStoryViewer }} />
      </main>
      <BottomNavigation />
      
      {storyViewer.isOpen && (
        <StoryViewer
          stories={storyViewer.stories}
          currentIndex={storyViewer.currentIndex}
          userId={storyViewer.userId}
          onClose={closeStoryViewer}
        />
      )}
    </div>
  )
}

export default Layout
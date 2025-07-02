import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const BottomNavigation = () => {
  const navItems = [
    { path: '/', icon: 'Home', label: 'Home' },
    { path: '/search', icon: 'Search', label: 'Search' },
    { path: '/create', icon: 'Plus', label: 'Create' },
    { path: '/profile', icon: 'User', label: 'Profile' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full ${
                    item.path === '/create' 
                      ? 'bg-gradient-to-r from-primary to-secondary' 
                      : isActive 
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10' 
                        : ''
                  }`}
                >
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={
                      item.path === '/create' 
                        ? 'text-white' 
                        : isActive 
                          ? 'text-primary' 
                          : 'text-gray-600'
                    }
                  />
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation
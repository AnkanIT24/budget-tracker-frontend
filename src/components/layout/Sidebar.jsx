import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, Target,
  Tag, Settings, LogOut, TrendingUp, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/AuthContext'

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'Transactions' },
  { to: '/budgets',      icon: Target,          label: 'Budgets'      },
  { to: '/categories',   icon: Tag,             label: 'Categories'   },
  { to: '/settings',     icon: Settings,        label: 'Settings'     },
]

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (onClose) onClose()
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full bg-silver">
      {/* Logo row */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-silver-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-moss rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp size={16} className="text-silver" />
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">BudgetTracker</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-silver-border transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }, i) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-moss-faint text-moss border-l-2 border-moss pl-[10px]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10'
              }`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-3 pb-5 pt-3 border-t border-silver-border flex-shrink-0">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-white font-medium truncate">{user?.fullName}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/20 active:bg-red-900/30 transition-colors duration-150"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop — fixed sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-56 border-r border-silver-border z-30">
        <SidebarContent />
      </aside>

      {/* Mobile — full-screen drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 z-40 md:hidden"
              onClick={onClose}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-50 md:hidden shadow-2xl"
            >
              <SidebarContent onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

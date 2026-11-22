
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Tag,
  Settings,
  LogOut,
  TrendingUp,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/AuthContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/budgets', icon: Target, label: 'Budgets' },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    onClose?.()
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-silver">

      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-silver-border px-4 sm:px-5">

        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-moss">
            <TrendingUp size={16} className="text-silver" />
          </div>

          <span className="truncate text-sm font-semibold tracking-wide text-white">
            BudgetTracker
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-lg text-gray-400
              transition-colors duration-200
              hover:bg-silver-border hover:text-white
              active:scale-95
            "
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4">

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `
                group relative flex min-h-11 items-center gap-3
                rounded-xl px-3 py-3
                text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? 'border-l-2 border-moss bg-moss-faint pl-[10px] text-moss'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10'
                }
              `
            }
          >
            <Icon
              size={19}
              className="shrink-0 transition-transform duration-200 group-hover:scale-105"
            />

            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User information and logout */}
      <div className="shrink-0 border-t border-silver-border px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">

        <div className="mb-1 min-w-0 px-3 py-2">
          <p className="truncate text-xs font-medium text-white">
            {user?.fullName || 'User'}
          </p>

          <p className="truncate text-xs text-gray-500">
            {user?.email || ''}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="
            flex w-full items-center gap-3
            rounded-xl px-3 py-3
            text-sm font-medium text-gray-400
            transition-colors duration-200
            hover:bg-red-900/20 hover:text-red-400
            active:bg-red-900/30
          "
        >
          <LogOut size={18} className="shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="
          fixed inset-y-0 left-0 z-30
          hidden w-56
          border-r border-silver-border
          md:block
        "
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            {/* Background overlay */}
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="
                fixed inset-0 z-40
                bg-black/70 backdrop-blur-[2px]
                md:hidden
              "
              aria-hidden="true"
            />

            {/* Sliding drawer */}
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                damping: 28,
                stiffness: 300,
                mass: 0.8,
              }}
              className="
                fixed inset-y-0 left-0 z-50
                w-[min(280px,85vw)]
                overflow-hidden
                border-r border-silver-border
                bg-silver shadow-2xl
                md:hidden
              "
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

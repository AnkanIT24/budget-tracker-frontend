import { useLocation } from 'react-router-dom'
import { Menu, TrendingUp } from 'lucide-react'

const titles = {
  '/':             'Dashboard',
  '/transactions': 'Transactions',
  '/budgets':      'Budgets',
  '/categories':   'Categories',
  '/settings':     'Settings',
}

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'Budget Tracker'

  return (
    <header className="h-14 md:h-16 border-b border-silver-border flex items-center px-4 gap-3 flex-shrink-0 bg-silver z-20">
      {/* Burger — mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-silver-border active:bg-silver-border/80 transition-colors flex-shrink-0 touch-manipulation"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden flex-shrink-0">
        <div className="w-7 h-7 bg-moss rounded-lg flex items-center justify-center">
          <TrendingUp size={14} className="text-silver" />
        </div>
      </div>

      <h1 className="text-base md:text-lg font-semibold text-white flex-1 truncate">{title}</h1>
    </header>
  )
}

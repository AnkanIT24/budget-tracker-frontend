
import { useLocation } from 'react-router-dom'
import { Menu, TrendingUp } from 'lucide-react'

const titles = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/categories': 'Categories',
  '/settings': 'Settings',
}

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'Budget Tracker'

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-14 sm:h-16 w-full shrink-0
        items-center gap-3
        border-b border-silver-border
        bg-silver
        px-3 sm:px-4 md:px-5 lg:px-6
      "
    >
      {/* Mobile navigation button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="
          flex md:hidden
          h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          text-gray-400
          transition-colors duration-200
          hover:bg-silver-border hover:text-white
          active:scale-95
          touch-manipulation
        "
        aria-label="Open navigation menu"
        aria-expanded={undefined}
      >
        <Menu size={21} />
      </button>

      {/* Mobile brand icon */}
      <div className="flex md:hidden shrink-0 items-center">
        <div
          className="
            flex h-8 w-8 items-center justify-center
            rounded-lg bg-moss
          "
        >
          <TrendingUp size={16} className="text-silver" />
        </div>
      </div>

      {/* Current page title */}
      <h1
        className="
          min-w-0 flex-1
          truncate
          text-base sm:text-lg
          font-semibold
          tracking-tight
          text-white
        "
      >
        {title}
      </h1>
    </header>
  )
}

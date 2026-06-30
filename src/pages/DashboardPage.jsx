import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, ArrowRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { transactionService, budgetService } from '../services/api'
import PageWrapper, { staggerContainer, staggerItem } from '../components/ui/PageWrapper'
import { StatCardSkeleton, RowSkeleton, DashboardBudgetSkeleton } from '../components/ui/Skeleton'
import { toast } from 'sonner'

function StatCard({ label, value, icon: Icon, color, delay, negative }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{
        scale: 1.013,
        y: -3,
        boxShadow: negative
          ? '0 8px 32px rgba(248,113,113,0.1)'
          : '0 8px 32px rgba(43,238,52,0.08)',
        borderColor: negative
          ? 'rgba(248,113,113,0.25)'
          : 'rgba(43,238,52,0.22)',
        transition: { duration: 0.22 }
      }}
      whileTap={{ scale: 0.98 }}
      style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(42,42,42,1)' }}
      className="card cursor-default"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</span>
        <motion.div
          whileHover={{ rotate: 8, scale: 1.15 }}
          transition={{ duration: 0.2 }}
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon size={15} />
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
        className="text-xl md:text-2xl font-semibold text-white tracking-tight"
      >
        ₹{Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </motion.p>
    </motion.div>
  )
}

function BudgetBar({ budget }) {
  const pct = Math.min(budget.percentageUsed, 100)
  const over = budget.isOverBudget
  const warn = budget.percentageUsed > 80
  const barColor = over ? 'bg-red-500' : warn ? 'bg-yellow-400' : 'bg-moss'
  return (
    <motion.div variants={staggerItem} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-white text-sm font-medium">{budget.categoryName}</span>
        <span className={`text-xs ${over ? 'text-red-400' : warn ? 'text-yellow-400' : 'text-gray-400'}`}>
          ₹{Number(budget.spent||0).toLocaleString('en-IN')} / ₹{Number(budget.monthlyLimit||0).toLocaleString('en-IN')}
        </span>
      </div>
      <div className="h-1.5 bg-silver-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
      {over && (
        <div className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle size={11} />
          Over by ₹{Number(Math.abs(budget.remaining)).toLocaleString('en-IN')}
        </div>
      )}
    </motion.div>
  )
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)
  const now   = new Date()           // read the current date when the page mounts
  const month = now.getMonth() + 1
  const year  = now.getFullYear()

  useEffect(() => {
    const load = async () => {
      try {
        const [s, b, t] = await Promise.all([
          transactionService.getSummary(month, year),
          budgetService.getStatus(month, year),
          transactionService.getAll({ month, year }),
        ])
        setSummary(s); setBudgets(b); setRecent(t.slice(0, 5))
      } catch { toast.error('Failed to load dashboard') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const monthName  = now.toLocaleString('default', { month: 'long' })
  const isNegative = (summary?.netBalance ?? 0) < 0

  return (
    <PageWrapper>
      <div className="space-y-5 md:space-y-6">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-lg md:text-xl font-semibold text-white">{monthName} {year}</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your financial snapshot</p>
        </motion.div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[0,1,2].map(i => <StatCardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
          >
            <StatCard label="Income"   value={summary?.totalIncome}  icon={TrendingUp}  color="bg-moss-faint text-moss"     delay={0}    negative={false} />
            <StatCard label="Expenses" value={summary?.totalExpense} icon={TrendingDown} color="bg-red-900/40 text-red-400" delay={0.05} negative={true}  />
            <StatCard label="Balance"  value={summary?.netBalance}   icon={Wallet}
              color={isNegative ? 'bg-red-900/40 text-red-400' : 'bg-moss-faint text-moss'}
              delay={0.1}
              negative={isNegative}
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {/* Budget status */}
          <motion.div
            whileHover={{ borderColor: 'rgba(43,238,52,0.15)', transition: { duration: 0.2 } }}
            style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(42,42,42,1)' }}
            className="card space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-medium text-sm">Budget status</h2>
              <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                <Link to="/budgets" className="text-moss text-xs hover:text-moss-dim transition-colors flex items-center gap-1">
                  Manage <ArrowRight size={12} />
                </Link>
              </motion.div>
            </div>
            {loading ? (
              <DashboardBudgetSkeleton />
            ) : budgets.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No budgets set for this month</p>
            ) : (
              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
                {budgets.map(b => <BudgetBar key={b.budgetId} budget={b} />)}
              </motion.div>
            )}
          </motion.div>

          {/* Recent transactions */}
          <motion.div
            whileHover={{ borderColor: 'rgba(43,238,52,0.15)', transition: { duration: 0.2 } }}
            style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(42,42,42,1)' }}
            className="card p-0 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-silver-border">
              <h2 className="text-white font-medium text-sm">Recent transactions</h2>
              <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                <Link to="/transactions" className="text-moss text-xs hover:text-moss-dim transition-colors flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </Link>
              </motion.div>
            </div>
            {loading ? (
              <div className="divide-y divide-silver-border">
                {[0,1,2,3,4].map(i => <RowSkeleton key={i} />)}
              </div>
            ) : recent.length === 0 ? (
              <p className="text-gray-500 text-sm py-8 text-center">No transactions yet</p>
            ) : (
              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="divide-y divide-silver-border">
                {recent.map(t => (
                  <motion.div
                    key={t.id}
                    variants={staggerItem}
                    whileHover={{ backgroundColor: 'rgba(43,238,52,0.04)', x: 2 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-3 px-4 md:px-5 py-3 cursor-default"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.15 }}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold
                        ${t.type === 'INCOME' ? 'bg-moss-faint text-moss' : 'bg-red-900/30 text-red-400'}`}
                    >
                      {t.categoryName?.[0] || '?'}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{t.categoryName}</p>
                      <p className="text-gray-500 text-xs truncate">{t.note || t.date}</p>
                    </div>
                    <span className={`text-sm font-medium flex-shrink-0 ${t.type === 'INCOME' ? 'text-moss' : 'text-red-400'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRight,
  Sparkles,
  PieChart as PieIcon,
  CalendarDays,
  RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import {
  transactionService,
  budgetService,
  aiService
} from '../services/api'

import PageWrapper, {
  staggerContainer,
  staggerItem
} from '../components/ui/PageWrapper'

import {
  StatCardSkeleton,
  RowSkeleton,
  DashboardBudgetSkeleton
} from '../components/ui/Skeleton'


const money = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 0
  })}`

const monthName = (date) =>
  date.toLocaleString('en-IN', { month: 'long' })


/* =========================================================
   FINANCIAL SUMMARY CARD
========================================================= */

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  hint,
  delay = 0
}) {
  const colors = {
    green: {
      border: 'border-emerald-500/20',
      line: 'bg-emerald-500',
      icon: 'bg-emerald-500/10 text-emerald-400'
    },
    red: {
      border: 'border-rose-500/20',
      line: 'bg-rose-500',
      icon: 'bg-rose-500/10 text-rose-400'
    },
    purple: {
      border: 'border-violet-500/25',
      line: 'bg-violet-500',
      icon: 'bg-violet-500/10 text-violet-300'
    }
  }

  const color = colors[tone] || colors.purple

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{
        y: -3,
        transition: { duration: 0.2 }
      }}
      className={`relative min-w-0 overflow-hidden rounded-2xl border bg-[#1b1b1b] p-4 sm:p-5 ${color.border}`}
    >
      <div className={`absolute inset-x-0 top-0 h-[3px] ${color.line}`} />

      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
          {label}
        </span>

        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color.icon}`}>
          <Icon size={18} />
        </span>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.15, duration: 0.4 }}
        className="break-words text-2xl font-semibold tracking-tight text-white sm:text-[28px]"
      >
        {money(value)}
      </motion.p>

      {hint && (
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          {hint}
        </p>
      )}
    </motion.div>
  )
}


/* =========================================================
   SPENDING ANALYSIS
========================================================= */

function SpendingTrend({
  history,
  currentSummary,
  currentMonth,
  currentYear
}) {
  const points = useMemo(() => {
    const previous = (history || []).map((item) => ({
      label: new Date(
        item.year,
        item.month - 1,
        1
      ).toLocaleString('en-IN', { month: 'short' }),

      income: Number(item.totalIncome || 0),
      expense: Number(item.totalExpense || 0)
    }))

    return [
      ...previous,
      {
        label: new Date(
          currentYear,
          currentMonth - 1,
          1
        ).toLocaleString('en-IN', { month: 'short' }),

        income: Number(currentSummary?.totalIncome || 0),
        expense: Number(currentSummary?.totalExpense || 0)
      }
    ]
  }, [
    history,
    currentSummary,
    currentMonth,
    currentYear
  ])

  const max = Math.max(
    1,
    ...points.flatMap(point => [
      point.income,
      point.expense
    ])
  )

  const width = 600
  const height = 220
  const left = 8
  const right = 12
  const top = 16
  const bottom = 30

  const x = (index) =>
    points.length <= 1
      ? width / 2
      : left + index * (
          (width - left - right) / (points.length - 1)
        )

  const y = (value) =>
    height - bottom -
    (value / max) * (height - top - bottom)

  const line = (key) =>
    points.map((point, index) =>
      `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point[key])}`
    ).join(' ')

  const area = (key) =>
    `${line(key)} L ${x(points.length - 1)} ${height - bottom} L ${x(0)} ${height - bottom} Z`

  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#1b1b1b] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">
            Spending analysis
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Income and expenses across recorded months
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 sm:gap-4 sm:text-xs">
          <span className="flex items-center gap-2">
            <i className="h-2 w-2 rounded-full bg-emerald-400" />
            Income
          </span>

          <span className="flex items-center gap-2">
            <i className="h-2 w-2 rounded-full bg-violet-400" />
            Expenses
          </span>
        </div>
      </div>

      {points.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-slate-500">
          No financial history available yet.
        </div>
      ) : (
        <div className="w-full min-w-0">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="block h-auto max-h-[230px] w-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Monthly income and expense trend"
          >
            <defs>
              <linearGradient
                id="incomeFill"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#34d399"
                  stopOpacity=".28"
                />
                <stop
                  offset="100%"
                  stopColor="#34d399"
                  stopOpacity="0"
                />
              </linearGradient>

              <linearGradient
                id="expenseFill"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#a78bfa"
                  stopOpacity=".24"
                />
                <stop
                  offset="100%"
                  stopColor="#a78bfa"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3].map((number) => {
              const yy =
                top + number * (
                  (height - top - bottom) / 3
                )

              return (
                <line
                  key={number}
                  x1={left}
                  x2={width - right}
                  y1={yy}
                  y2={yy}
                  stroke="rgba(148,163,184,.12)"
                  strokeDasharray="4 5"
                />
              )
            })}

            <path
              d={area('income')}
              fill="url(#incomeFill)"
            />

            <path
              d={area('expense')}
              fill="url(#expenseFill)"
            />

            <path
              d={line('income')}
              fill="none"
              stroke="#34d399"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={line('expense')}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point, index) => (
              <g key={`${point.label}-${index}`}>
                <circle
                  cx={x(index)}
                  cy={y(point.income)}
                  r="4"
                  fill="#34d399"
                  stroke="#1b1b1b"
                  strokeWidth="2"
                />

                <circle
                  cx={x(index)}
                  cy={y(point.expense)}
                  r="4"
                  fill="#a78bfa"
                  stroke="#1b1b1b"
                  strokeWidth="2"
                />

                <text
                  x={x(index)}
                  y={height - 7}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="12"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      <p className="mt-2 text-[10px] leading-relaxed text-slate-600">
        Based on the monthly financial history returned by your account.
      </p>
    </div>
  )
}


/* =========================================================
   CATEGORY BREAKDOWN
========================================================= */

function CategoryBreakdown({ categories }) {
  const rows = (categories || [])
    .filter(item => Number(item.totalSpent) > 0)
    .slice(0, 5)

  const total = rows.reduce(
    (sum, item) => sum + Number(item.totalSpent || 0),
    0
  )

  const palette = [
    '#34d399',
    '#a78bfa',
    '#60a5fa',
    '#f59e0b',
    '#f472b6'
  ]

  let offset = 0

  const gradient = rows.length
    ? `conic-gradient(${rows.map((item, index) => {
        const start = offset

        offset += total
          ? Number(item.totalSpent) / total * 100
          : 0

        return `${palette[index % palette.length]} ${start}% ${offset}%`
      }).join(', ')})`
    : 'conic-gradient(#333 0% 100%)'

  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#1b1b1b] p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">
            Category spending
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Where your money is going this month
          </p>
        </div>

        <PieIcon size={18} className="shrink-0 text-slate-500" />
      </div>

      {rows.length === 0 ? (
        <div className="flex h-36 items-center justify-center text-sm text-slate-500">
          No expense categories recorded.
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
          <div
            className="relative h-32 w-32 shrink-0 rounded-full"
            style={{ background: gradient }}
          >
            <div className="absolute inset-[17px] flex flex-col items-center justify-center rounded-full bg-[#1b1b1b]">
              <span className="text-[10px] text-slate-500">
                Total
              </span>

              <span className="text-sm font-semibold text-white">
                {money(total)}
              </span>
            </div>
          </div>

          <div className="w-full min-w-0 flex-1 space-y-3">
            {rows.map((item, index) => (
              <div
                key={item.categoryId || item.categoryName}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="flex min-w-0 items-center gap-2 text-slate-300">
                  <i
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background: palette[index % palette.length]
                    }}
                  />

                  <span className="truncate">
                    {item.categoryName}
                  </span>
                </span>

                <span className="shrink-0 font-medium text-slate-400">
                  {Number(item.percentageOfTotal || 0).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


/* =========================================================
   BUDGET STATUS
========================================================= */

function BudgetList({ budgets, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#1b1b1b] p-5">
        <DashboardBudgetSkeleton />
      </div>
    )
  }

  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#1b1b1b] p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-white">
          Budget status
        </h2>

        <Link
          to="/budgets"
          className="flex shrink-0 items-center gap-1 text-xs text-emerald-400 transition hover:text-emerald-300"
        >
          Manage <ArrowRight size={13} />
        </Link>
      </div>

      {budgets.length === 0 ? (
        <p className="py-5 text-center text-sm text-slate-500">
          No budgets set for this month.
        </p>
      ) : (
        <div className="space-y-5">
          {budgets.map((budget) => {
            const used = Number(budget.percentageUsed || 0)

            const over =
              budget.overBudget ??
              budget.isOverBudget ??
              used > 100

            const color = over
              ? 'bg-rose-500'
              : used > 80
                ? 'bg-amber-400'
                : 'bg-emerald-400'

            return (
              <div
                key={budget.budgetId}
                className="min-w-0 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-200">
                    {budget.categoryName}
                  </span>

                  <span className={`text-xs ${over ? 'text-rose-400' : 'text-slate-400'}`}>
                    {money(budget.spent)} / {money(budget.monthlyLimit)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(used, 100)}%`
                    }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${color}`}
                  />
                </div>

                {over && (
                  <p className="text-xs text-rose-400">
                    Over budget by {money(Math.abs(budget.remaining))}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


/* =========================================================
   RECENT TRANSACTIONS
========================================================= */

function RecentTransactions({ transactions, loading }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#1b1b1b]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
        <h2 className="font-semibold text-white">
          Recent transactions
        </h2>

        <Link
          to="/transactions"
          className="flex shrink-0 items-center gap-1 text-xs text-emerald-400 transition hover:text-emerald-300"
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div className="divide-y divide-white/[0.06]">
          {[0, 1, 2, 3].map(index => (
            <RowSkeleton key={index} />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No transactions yet.
        </p>
      ) : (
        <div className="divide-y divide-white/[0.06]">
          {transactions.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex min-w-0 items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.025] sm:px-5"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${
                  item.type === 'INCOME'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {item.categoryName?.[0] || '?'}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-200">
                  {item.categoryName || 'Transaction'}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {item.note || item.date}
                </p>
              </div>

              <span
                className={`shrink-0 text-xs font-semibold sm:text-sm ${
                  item.type === 'INCOME'
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {item.type === 'INCOME' ? '+' : '−'}
                {money(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


/* =========================================================
   AI BUDGET SAVER
========================================================= */

function AiBudgetSaver() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I’m your AI Budget Saver. Ask me about your spending, budgets or financial goals.'
    }
  ])

  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const send = async (text = input) => {
    const message = text.trim()

    if (!message || sending) return

    setMessages(current => [
      ...current,
      { role: 'user', content: message }
    ])

    setInput('')
    setSending(true)

    try {
      const result = await aiService.chat({ message })

      const answer =
        result?.response ||
        result?.message ||
        result?.reply ||
        'I could not generate a response right now.'

      setMessages(current => [
        ...current,
        { role: 'assistant', content: answer }
      ])
    } catch (error) {
      const serverMessage = error.response?.data?.message

      setMessages(current => [
        ...current,
        {
          role: 'assistant',
          content: serverMessage ||
            'The AI service is temporarily unavailable. Please try again later.'
        }
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <aside className="flex min-h-[480px] min-w-0 flex-col overflow-hidden rounded-2xl border border-violet-400/25 bg-[#191820] shadow-[0_12px_50px_rgba(124,58,237,0.08)] xl:sticky xl:top-0 xl:h-[calc(100vh-7.5rem)]">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.08] bg-gradient-to-r from-violet-500/10 to-transparent px-4 py-4 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
          <Sparkles size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-white">
            AI Budget Saver
          </h2>

          <p className="text-[11px] text-slate-500">
            Your personal budget assistant
          </p>
        </div>

        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.7)]" />
      </div>

      {/* Conversation */}
      <div className="min-h-[240px] flex-1 space-y-4 overflow-y-auto overscroll-contain p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[90%] break-words whitespace-pre-wrap rounded-2xl px-3.5 py-3 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'rounded-br-md bg-violet-500/20 text-violet-50'
                  : 'rounded-bl-md border border-white/[0.07] bg-white/[0.045] text-slate-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            AI Budget Saver is thinking…
          </div>
        )}
      </div>

      {/* Suggested prompts and input */}
      <div className="shrink-0 border-t border-white/[0.08] p-3 sm:p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {[
            'How am I spending this month?',
            'How can I save more?'
          ].map(prompt => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              disabled={sending}
              className="rounded-full border border-white/10 px-3 py-2 text-[11px] text-slate-400 transition hover:border-violet-400/40 hover:text-violet-200 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
          className="flex min-w-0 items-end gap-2 rounded-xl border border-violet-400/30 bg-black/20 p-2 transition focus-within:border-violet-400/70"
        >
          <textarea
            value={input}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => {
              if (
                event.key === 'Enter' &&
                !event.shiftKey
              ) {
                event.preventDefault()
                send()
              }
            }}
            rows={2}
            placeholder="Ask AI Budget Saver…"
            className="max-h-28 min-h-[44px] min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-600"
          />

          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <ArrowRight size={17} />
          </button>
        </form>

        <p className="mt-2 text-center text-[10px] text-slate-600">
          AI responses may be unavailable when the provider quota is reached.
        </p>
      </div>
    </aside>
  )
}


/* =========================================================
   DASHBOARD PAGE
========================================================= */

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [budgets, setBudgets] = useState([])
  const [recent, setRecent] = useState([])
  const [context, setContext] = useState(null)

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const load = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true)
    }

    try {
      const [
        summaryResult,
        budgetResult,
        transactionResult,
        contextResult
      ] = await Promise.allSettled([
        transactionService.getSummary(month, year),
        budgetService.getStatus(month, year),
        transactionService.getAll({ month, year }),
        aiService.getContext()
      ])

      if (summaryResult.status === 'fulfilled') {
        setSummary(summaryResult.value)
      }

      if (budgetResult.status === 'fulfilled') {
        setBudgets(
          Array.isArray(budgetResult.value)
            ? budgetResult.value
            : []
        )
      }

      if (transactionResult.status === 'fulfilled') {
        setRecent(
          Array.isArray(transactionResult.value)
            ? transactionResult.value
            : []
        )
      }

      if (contextResult.status === 'fulfilled') {
        setContext(contextResult.value)
      }

      if (
        [
          summaryResult,
          budgetResult,
          transactionResult
        ].every(result => result.status === 'rejected')
      ) {
        toast.error('Unable to load your financial data')
      }
    } catch {
      toast.error('Unable to load dashboard')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const monthTitle = `${monthName(now)} ${year}`

  const savingsRate = summary?.totalIncome > 0
    ? (
        Number(summary.netBalance || 0) /
        Number(summary.totalIncome)
      ) * 100
    : null

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-[1800px] min-w-0 space-y-5">

        {/* Page heading */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays size={13} />
              {monthTitle}
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-[28px]">
              Your financial overview
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              A clear picture of your money, all in one place.
            </p>
          </div>

          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs text-slate-400 transition hover:border-emerald-400/30 hover:text-emerald-300 disabled:opacity-50"
          >
            <RefreshCw
              size={13}
              className={refreshing ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>


        {/* Financial summary */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {loading ? (
            [0, 1, 2].map(index => (
              <StatCardSkeleton key={index} />
            ))
          ) : (
            <>
              <StatCard
                label="Total income"
                value={summary?.totalIncome}
                icon={TrendingUp}
                tone="green"
                hint="Recorded income this month"
              />

              <StatCard
                label="Total expenses"
                value={summary?.totalExpense}
                icon={TrendingDown}
                tone="red"
                hint="Recorded expenses this month"
                delay={0.05}
              />

              <StatCard
                label="Available balance"
                value={summary?.netBalance}
                icon={Wallet}
                tone="purple"
                hint={
                  savingsRate === null
                    ? 'No income recorded this month'
                    : `${savingsRate.toFixed(1)}% of recorded income remains`
                }
                delay={0.1}
              />
            </>
          )}
        </motion.div>


        {/* Main dashboard and AI assistant */}
        <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px] 2xl:grid-cols-[minmax(0,1fr)_380px]">

          {/* Financial information */}
          <div className="min-w-0 space-y-5">

            {/* Spending analysis */}
            <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.9fr)]">
              <SpendingTrend
                history={context?.monthlyFinancialHistory || []}
                currentSummary={summary}
                currentMonth={month}
                currentYear={year}
              />

              <CategoryBreakdown
                categories={context?.categorySpending || []}
              />
            </div>

            {/* Budgets and transactions */}
            <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
              <BudgetList
                budgets={budgets}
                loading={loading}
              />

              <RecentTransactions
                transactions={recent}
                loading={loading}
              />
            </div>
          </div>

          {/* AI Budget Saver */}
          <AiBudgetSaver />

        </div>
      </div>
    </PageWrapper>
  )
}

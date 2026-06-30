import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Target, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { budgetService, categoryService } from '../services/api'
import PageWrapper, { staggerContainer, staggerItem } from '../components/ui/PageWrapper'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import { BudgetCardSkeleton } from '../components/ui/Skeleton'

// Returns the *current* date each time it's called (not frozen at page load)
const today = () => new Date()
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const schema = z.object({
  categoryId:   z.coerce.number().min(1, 'Select a category'),
  monthlyLimit: z.coerce.number().min(0.01, 'Limit must be > 0'),
  month:        z.coerce.number().min(1).max(12),
  year:         z.coerce.number().min(2000),
})

export default function BudgetsPage() {
  const [budgets,      setBudgets]      = useState([])
  const [categories,   setCategories]   = useState([])
  const [loading,      setLoading]      = useState(true)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editing,      setEditing]      = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)
  const [month, setMonth] = useState(() => today().getMonth() + 1)
  const [year,  setYear]  = useState(() => today().getFullYear())

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [b, c] = await Promise.all([budgetService.getStatus(month, year), categoryService.getByType('EXPENSE')])
      setBudgets(b); setCategories(c)
    } catch { toast.error('Failed to load budgets') }
    finally { setLoading(false) }
  }, [month, year])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); reset({ month, year }); setModalOpen(true) }
  const openEdit   = (b) => { setEditing(b);   reset({ categoryId: b.categoryId, monthlyLimit: b.monthlyLimit, month, year }); setModalOpen(true) }

  const onSubmit = async (data) => {
    try {
      if (editing) { await budgetService.update(editing.budgetId, { monthlyLimit: data.monthlyLimit }); toast.success('Updated') }
      else         { await budgetService.create(data); toast.success('Budget set') }
      setModalOpen(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Something went wrong') }
  }

  const onDelete = async () => {
    setDeleting(true)
    try { await budgetService.delete(deleteTarget.budgetId); toast.success('Removed'); setDeleteTarget(null); load() }
    catch { toast.error('Failed to delete') }
    finally { setDeleting(false) }
  }

  return (
    <PageWrapper>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-white">Budgets</h1>
            <p className="text-gray-500 text-xs mt-0.5">{budgets.length} active</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(43,238,52,0.2)' }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreate} className="btn-primary flex items-center gap-1.5 text-sm px-3 py-2">
            <Plus size={15} /> Set budget
          </motion.button>
        </div>

        <div className="flex gap-2">
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="input-field w-28 py-1.5 text-xs">
            {months.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="input-field w-24 py-1.5 text-xs">
            {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_,i) => <BudgetCardSkeleton key={i} />)}</div>
        ) : budgets.length === 0 ? (
          <div className="card"><EmptyState icon={Target} title="No budgets" description="Set spending limits for your expense categories." /></div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
            <AnimatePresence>
              {budgets.map(b => {
                const pct = Math.min(b.percentageUsed, 100)
                const over = b.isOverBudget
                const warn = b.percentageUsed > 80
                const barColor  = over ? 'bg-red-500' : warn ? 'bg-yellow-400' : 'bg-moss'
                const textColor = over ? 'text-red-400' : warn ? 'text-yellow-400' : 'text-moss'
                return (
                  <motion.div key={b.budgetId} variants={staggerItem} layout
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
                    whileHover={{
                      scale: 1.01, y: -2,
                      borderColor: over ? 'rgba(248,113,113,0.25)' : 'rgba(43,238,52,0.2)',
                      boxShadow: over ? '0 6px 24px rgba(248,113,113,0.08)' : '0 6px 24px rgba(43,238,52,0.07)',
                      transition: { duration: 0.2 }
                    }}
                    style={{ borderWidth: 1, borderStyle: 'solid' }}
                    className="card group cursor-default"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{b.categoryName}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          ₹{Number(b.spent||0).toLocaleString('en-IN')} spent of ₹{Number(b.monthlyLimit||0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {over && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="flex items-center gap-1 text-xs text-red-400 bg-red-900/20 px-2 py-0.5 rounded-full">
                            <AlertCircle size={10} /> Over
                          </motion.span>
                        )}
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                          onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-silver-border transition-colors">
                          <Pencil size={13} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteTarget(b)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                          <Trash2 size={13} />
                        </motion.button>
                      </div>
                    </div>
                    <div className="h-2 bg-silver-border rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={`h-full rounded-full ${barColor}`} />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className={`text-xs font-medium ${textColor}`}>{b.percentageUsed.toFixed(1)}% used</span>
                      <span className={`text-xs ${over ? 'text-red-400' : 'text-gray-500'}`}>
                        {over ? `-₹${Number(Math.abs(b.remaining)).toLocaleString('en-IN')} over` : `₹${Number(b.remaining).toLocaleString('en-IN')} left`}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit limit' : 'Set budget'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!editing && (
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Expense category</label>
              <select {...register('categoryId')} className="input-field">
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-red-400 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Monthly limit (₹)</label>
            <input {...register('monthlyLimit')} type="number" step="0.01" placeholder="0.00" className="input-field" />
            {errors.monthlyLimit && <p className="text-red-400 text-xs mt-1">{errors.monthlyLimit.message}</p>}
          </div>
          {!editing && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Month</label>
                <select {...register('month')} className="input-field" defaultValue={month}>
                  {months.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Year</label>
                <select {...register('year')} className="input-field" defaultValue={year}>
                  {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1 text-sm">Cancel</motion.button>
            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(43,238,52,0.2)' }}
              whileTap={{ scale: 0.97 }}
              type="submit" disabled={isSubmitting} className="btn-primary flex-1 text-sm py-2.5">
              {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Set budget'}
            </motion.button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={onDelete}
        loading={deleting} title="Remove budget" message={`Remove the budget for ${deleteTarget?.categoryName}?`} />
    </PageWrapper>
  )
}
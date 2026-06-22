import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { transactionService, categoryService } from '../services/api'
import PageWrapper, { staggerContainer, staggerItem } from '../components/ui/PageWrapper'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import { RowSkeleton } from '../components/ui/Skeleton'

const now = new Date()
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const schema = z.object({
  categoryId: z.string().min(1, 'Select a category'),
  type:       z.enum(['INCOME', 'EXPENSE']),
  amount:     z.coerce.number().min(0.01, 'Amount must be > 0'),
  note:       z.string().optional(),
  date:       z.string().min(1, 'Date is required'),
})

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [categories,   setCategories]   = useState([])
  const [loading,      setLoading]      = useState(true)
  const [modalOpen,    setModalOpen]    = useState(false)
  const [filterOpen,   setFilterOpen]   = useState(false)
  const [editing,      setEditing]      = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)
  const [filters, setFilters] = useState({
    month: now.getMonth() + 1,
    year:  now.getFullYear(),
    type: '',
    categoryId: ''
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type:       'EXPENSE',
      categoryId: '',
      amount:     '',
      note:       '',
      date:       now.toISOString().split('T')[0]
    }
  })

  // Watch the type so we can filter categories
  const selectedType = useWatch({ control, name: 'type', defaultValue: 'EXPENSE' })

  // Filtered categories based on selected type
  const filteredCategories = categories.filter(c => c.type === selectedType)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { month: filters.month, year: filters.year }
      if (filters.type)       params.type       = filters.type
      if (filters.categoryId) params.categoryId = filters.categoryId
      const [t, c] = await Promise.all([
        transactionService.getAll(params),
        categoryService.getAll()
      ])
      setTransactions(t)
      setCategories(c)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditing(null)
    reset({
      type:       'EXPENSE',
      categoryId: '',
      amount:     '',
      note:       '',
      date:       now.toISOString().split('T')[0]
    })
    setModalOpen(true)
  }

  const openEdit = (t) => {
    setEditing(t)
    reset({
      categoryId: String(t.categoryId),
      type:       t.type,
      amount:     t.amount,
      note:       t.note || '',
      date:       t.date
    })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    // Convert categoryId to number before sending
    const payload = { ...data, categoryId: Number(data.categoryId) }
    try {
      if (editing) {
        await transactionService.update(editing.id, payload)
        toast.success('Transaction updated')
      } else {
        await transactionService.create(payload)
        toast.success('Transaction added')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  const onDelete = async () => {
    setDeleting(true)
    try {
      await transactionService.delete(deleteTarget.id)
      toast.success('Deleted')
      setDeleteTarget(null)
      load()
    } catch { toast.error('Failed to delete') }
    finally { setDeleting(false) }
  }

  return (
    <PageWrapper>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-white">Transactions</h1>
            <p className="text-gray-500 text-xs mt-0.5">{transactions.length} records</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setFilterOpen(f => !f)}
              className={`p-2 rounded-lg border transition-colors ${
                filterOpen
                  ? 'border-moss text-moss bg-moss-faint'
                  : 'border-silver-border text-gray-400'
              }`}
            >
              <SlidersHorizontal size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(43,238,52,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreate}
              className="btn-primary flex items-center gap-1.5 text-sm px-3 py-2"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Add</span> transaction
            </motion.button>
          </div>
        </div>

        {/* Collapsible filters */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="card py-3 overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <select
                  value={filters.month}
                  onChange={e => setFilters(f => ({ ...f, month: e.target.value }))}
                  className="input-field py-1.5 text-xs"
                >
                  {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <select
                  value={filters.year}
                  onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
                  className="input-field py-1.5 text-xs"
                >
                  {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select
                  value={filters.type}
                  onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                  className="input-field py-1.5 text-xs"
                >
                  <option value="">All types</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
                <select
                  value={filters.categoryId}
                  onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value }))}
                  className="input-field py-1.5 text-xs"
                >
                  <option value="">All categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction list */}
        <motion.div
          whileHover={{ borderColor: 'rgba(43,238,52,0.12)', transition: { duration: 0.25 } }}
          style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(42,42,42,1)' }}
          className="card p-0 overflow-hidden"
        >
          {loading ? (
            <div className="divide-y divide-silver-border">
              {[...Array(6)].map((_, i) => <RowSkeleton key={i} />)}
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={ArrowUpDown}
              title="No transactions"
              description="Add your first income or expense to get started."
            />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="divide-y divide-silver-border"
            >
              <AnimatePresence>
                {transactions.map(t => (
                  <motion.div
                    key={t.id}
                    variants={staggerItem}
                    layout
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.18 } }}
                    whileHover={{ backgroundColor: 'rgba(43,238,52,0.04)', x: 2 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-3 px-4 py-3.5 group cursor-default"
                  >
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 6 }}
                      transition={{ duration: 0.15 }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                        t.type === 'INCOME' ? 'bg-moss-faint text-moss' : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      {t.categoryName?.[0]}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{t.categoryName}</p>
                      <p className="text-gray-500 text-xs truncate">{t.note || '—'} · {t.date}</p>
                    </div>
                    <span className={`font-semibold text-sm flex-shrink-0 ${
                      t.type === 'INCOME' ? 'text-moss' : 'text-red-400'
                    }`}>
                      {t.type === 'INCOME' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                    </span>
                    <div className="flex gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                        onClick={() => openEdit(t)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-silver-border transition-colors"
                      >
                        <Pencil size={13} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteTarget(t)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={13} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit transaction' : 'Add transaction'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Type selector */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['EXPENSE', 'INCOME'].map(t => (
                <label
                  key={t}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border cursor-pointer transition-all text-sm font-medium ${
                    selectedType === t
                      ? t === 'INCOME'
                        ? 'border-moss bg-moss-faint text-moss'
                        : 'border-red-500 bg-red-900/20 text-red-400'
                      : 'border-silver-border text-gray-500 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    value={t}
                    className="hidden"
                    {...register('type')}
                    onChange={() => {
                      setValue('type', t)
                      setValue('categoryId', '') // reset category when type changes
                    }}
                  />
                  {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
                </label>
              ))}
            </div>
          </div>

          {/* Category — filtered by type */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              Category
              {filteredCategories.length === 0 && (
                <span className="ml-2 text-yellow-400">
                  — No {selectedType.toLowerCase()} categories yet
                </span>
              )}
            </label>
            <select {...register('categoryId')} className="input-field">
              <option value="">Select category...</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-400 text-xs mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Amount (₹)</label>
            <input
              {...register('amount')}
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className="input-field"
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Date</label>
            <input {...register('date')} type="date" className="input-field" />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Note (optional)</label>
            <input
              {...register('note')}
              type="text"
              placeholder="What was this for?"
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-ghost flex-1 text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(43,238,52,0.2)' }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 text-sm py-2.5"
            >
              {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Add'}
            </motion.button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        loading={deleting}
        title="Delete transaction"
        message={`Delete this ₹${Number(deleteTarget?.amount || 0).toLocaleString('en-IN')} transaction? This cannot be undone.`}
      />
    </PageWrapper>
  )
}

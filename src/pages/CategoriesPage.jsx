import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Tag, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { categoryService } from '../services/api'
import PageWrapper, { staggerContainer, staggerItem } from '../components/ui/PageWrapper'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import { CategorySectionSkeleton } from '../components/ui/Skeleton'

function CategoryItem({ cat, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [name,    setName]    = useState(cat.name)
  const [saving,  setSaving]  = useState(false)

  const save = async () => {
    if (!name.trim() || name === cat.name) { setEditing(false); setName(cat.name); return }
    setSaving(true)
    try {
      await categoryService.update(cat.id, { name: name.trim(), type: cat.type })
      toast.success('Renamed'); setEditing(false)
    } catch { toast.error('Failed to rename'); setName(cat.name) }
    finally { setSaving(false) }
  }

  return (
    <motion.div variants={staggerItem} layout
      whileHover={{ backgroundColor: 'rgba(43,238,52,0.04)', x: 2 }}
      transition={{ duration: 0.15 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-default group"
    >
      <motion.div
        whileHover={{ scale: 1.12, rotate: 6 }}
        transition={{ duration: 0.15 }}
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${cat.type === 'INCOME' ? 'bg-moss-faint text-moss' : 'bg-red-900/30 text-red-400'}`}
      >
        {cat.name[0]}
      </motion.div>
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.input key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              autoFocus value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setEditing(false); setName(cat.name) } }}
              className="input-field py-1 text-sm w-full" />
          ) : (
            <motion.p key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-white text-sm font-medium">{cat.name}</motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {editing ? (
          <>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={save} disabled={saving}
              className="p-1.5 rounded-lg text-moss hover:bg-moss-faint transition-colors"><Check size={13} /></motion.button>
            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={() => { setEditing(false); setName(cat.name) }}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors"><X size={13} /></motion.button>
          </>
        ) : (
          <>
            <motion.button whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.07)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors"><Pencil size={13} /></motion.button>
            <motion.button whileHover={{ scale: 1.15, backgroundColor: 'rgba(127,29,29,0.3)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(cat)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={13} /></motion.button>
          </>
        )}
      </div>
    </motion.div>
  )
}

function AddCategoryRow({ type, onAdded }) {
  const [open,   setOpen]   = useState(false)
  const [name,   setName]   = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      await categoryService.create({ name: name.trim(), type })
      toast.success('Category added'); setName(''); setOpen(false); onAdded()
    } catch { toast.error('Failed to create') }
    finally { setSaving(false) }
  }

  return (
    <div className="px-4 pb-3">
      <AnimatePresence>
        {open ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="flex gap-2 mt-2 overflow-hidden">
            <input autoFocus value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setOpen(false) }}
              placeholder="Category name..." className="input-field flex-1 py-1.5 text-sm" />
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={save} disabled={saving} className="btn-primary text-sm px-3 py-1.5 flex-shrink-0">
              {saving ? '...' : 'Add'}
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              onClick={() => setOpen(false)} className="btn-ghost text-sm px-2.5 py-1.5 flex-shrink-0"><X size={14} /></motion.button>
          </motion.div>
        ) : (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            whileHover={{ x: 3, color: '#2BEE34' }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-gray-500 text-sm transition-colors mt-2">
            <Plus size={14} /> Add {type.toLowerCase()} category
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,     setDeleting]     = useState(false)

  const load = async () => {
    setLoading(true)
    try { setCategories(await categoryService.getAll()) }
    catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const onDelete = async () => {
    setDeleting(true)
    try {
      await categoryService.delete(deleteTarget.id)
      toast.success('Deleted'); setDeleteTarget(null); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
      setDeleteTarget(null)
    } finally { setDeleting(false) }
  }

  const income  = categories.filter(c => c.type === 'INCOME')
  const expense = categories.filter(c => c.type === 'EXPENSE')

  const Section = ({ title, items, type, dotColor }) => (
    <motion.div variants={staggerItem}
      whileHover={{ borderColor: 'rgba(43,238,52,0.15)', transition: { duration: 0.2 } }}
      style={{ borderWidth: 1, borderStyle: 'solid' }}
      className="card p-0 overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-silver-border flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <h2 className="text-white font-medium text-sm">{title}</h2>
        <span className="text-gray-500 text-xs ml-auto">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-center text-gray-500 text-sm">No {type.toLowerCase()} categories yet</p>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          <AnimatePresence>
            {items.map(cat => <CategoryItem key={cat.id} cat={cat} onDelete={setDeleteTarget} />)}
          </AnimatePresence>
        </motion.div>
      )}
      <AddCategoryRow type={type} onAdded={load} />
    </motion.div>
  )

  return (
    <PageWrapper>
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-lg md:text-xl font-semibold text-white">Categories</h1>
          <p className="text-gray-500 text-xs mt-0.5">{income.length} income · {expense.length} expense</p>
        </motion.div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <CategorySectionSkeleton />
            <CategorySectionSkeleton />
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <Section title="Income"  items={income}  type="INCOME"  dotColor="bg-moss" />
            <Section title="Expense" items={expense} type="EXPENSE" dotColor="bg-red-500" />
          </motion.div>
        )}
      </div>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={onDelete}
        loading={deleting} title="Delete category"
        message={`Delete "${deleteTarget?.name}"? This will fail if the category has transactions.`} />
    </PageWrapper>
  )
}

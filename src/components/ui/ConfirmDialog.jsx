import Modal from './Modal'
import { motion } from 'framer-motion'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onConfirm} disabled={loading} className="btn-danger flex-1 text-sm disabled:opacity-50">
          {loading ? 'Deleting...' : 'Delete'}
        </motion.button>
      </div>
    </Modal>
  )
}

import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 text-center px-4"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-14 h-14 rounded-2xl bg-silver-border flex items-center justify-center mb-4"
      >
        <Icon size={24} className="text-gray-500" />
      </motion.div>
      <h3 className="text-white font-medium mb-1 text-sm">{title}</h3>
      <p className="text-gray-500 text-sm mb-5 max-w-xs leading-relaxed">{description}</p>
      {action}
    </motion.div>
  )
}

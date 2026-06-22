import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Desktop: centered card */}
          <motion.div
            key="desktop-modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden md:block fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70]
                       w-full max-w-md bg-silver-light border border-silver-border rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-base">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-silver-border transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>

          {/* Mobile: bottom sheet */}
          <motion.div
            key="mobile-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[70]
                       bg-silver-light border-t border-silver-border rounded-t-3xl
                       shadow-2xl overflow-y-auto"
            style={{ maxHeight: '92dvh' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-silver-border rounded-full" />
            </div>
            <div className="px-5 pb-8 pt-2">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold text-base">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-silver-border transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

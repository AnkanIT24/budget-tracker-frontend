
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background overlay */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Desktop modal */}
          <div className="hidden md:flex fixed inset-0 z-[70] items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="desktop-modal"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{
                duration: 0.22,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="
                pointer-events-auto
                w-full
                max-w-md
                max-h-[calc(100dvh-2rem)]
                overflow-y-auto
                overscroll-contain
                bg-silver-light
                border border-silver-border
                rounded-2xl
                shadow-2xl
                p-6
              "
              onClick={(event) => event.stopPropagation()}
            >
              {/* Modal header */}
              <div className="sticky top-0 z-10 flex items-center justify-between mb-5 bg-silver-light">
                <h2 className="text-white font-semibold text-base">
                  {title}
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="
                    p-1.5 rounded-lg
                    text-gray-500
                    hover:text-white
                    hover:bg-silver-border
                    transition-colors
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal content */}
              {children}
            </motion.div>
          </div>

          {/* Mobile bottom sheet */}
          <motion.div
            key="mobile-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 32,
              stiffness: 320,
            }}
            className="
              md:hidden
              fixed bottom-0 left-0 right-0
              z-[70]
              bg-silver-light
              border-t border-silver-border
              rounded-t-3xl
              shadow-2xl
              overflow-y-auto
              overscroll-contain
            "
            style={{ maxHeight: '92dvh' }}
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-silver-border rounded-full" />
            </div>

            <div className="px-5 pb-8 pt-2">
              {/* Mobile header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold text-base">
                  {title}
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="
                    p-1.5 rounded-lg
                    text-gray-500
                    hover:text-white
                    hover:bg-silver-border
                    transition-colors
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile content */}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
